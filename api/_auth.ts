import crypto from 'crypto';
import https from 'https';

// Cache public keys to prevent fetching them on every request
let cachedKeys: Record<string, string> = {};
let cacheTime = 0;

async function getGooglePublicKeys(): Promise<Record<string, string>> {
  const now = Date.now();
  // Cache keys for 1 hour
  if (now - cacheTime < 3600000 && Object.keys(cachedKeys).length > 0) {
    return cachedKeys;
  }

  try {
    const keysUrl = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken-system@system.gserviceaccount.com';
    let data = '';
    
    await new Promise<void>((resolve, reject) => {
      https.get(keysUrl, (res) => {
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve();
        });
      }).on('error', (err) => {
        reject(err);
      });
    });

    const keys = JSON.parse(data);
    if (keys && typeof keys === 'object') {
      cachedKeys = keys;
      cacheTime = now;
    }
  } catch (error) {
    console.error('[Auth] Failed to fetch Google public keys:', error);
  }

  return cachedKeys;
}

export async function verifyFirebaseIdToken(token: string, projectId: string): Promise<string | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode header and payload
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf8'));
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));

    const kid = header.kid;
    if (!kid) {
      return null;
    }

    // Verify standard claims
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      console.warn('[Auth] Token expired');
      return null;
    }
    if (payload.aud !== projectId) {
      console.warn('[Auth] Token audience mismatch:', payload.aud, 'expected:', projectId);
      return null;
    }
    if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
      console.warn('[Auth] Token issuer mismatch:', payload.iss);
      return null;
    }

    // Fetch Google's public certificates
    const keys = await getGooglePublicKeys();
    const cert = keys[kid];
    if (!cert) {
      console.warn('[Auth] Public certificate not found for kid:', kid);
      return null;
    }

    // Verify signature
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(parts[0] + '.' + parts[1]);
    
    // Convert base64url signature to standard base64
    const signatureBase64 = parts[2]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
      
    const isValid = verify.verify(cert, signatureBase64, 'base64');
    if (!isValid) {
      console.warn('[Auth] Kriptografi token tidak valid');
      return null;
    }

    return payload.sub; // Returns the Firebase UID
  } catch (err) {
    console.error('[Auth] Token verification failed:', err);
    return null;
  }
}
