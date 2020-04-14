/**
 * Check the format of env variables to determine whether the var is encrypted
 * - If they start with `ENCRYPTED:`, we'll try to decrypt them before using
 * - The format for an encrypted variable is `ENCRYPTED:${ALGORITHM}:${AWS_KMS_CMK_ARN_IN_BASE64}:${VARIABLE_CONTENT_IN_BASE64}`
 * - For now the available encryption algorithm are:
 *   + AES_256
 */

// TODO: Implement me.
