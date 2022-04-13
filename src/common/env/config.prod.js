const BASE_URL = 'https://is.regultek.gov.kg/'
const API_URL = 'https://is.regultek.gov.kg/api/'
const ESI_URL = 'https://esia.tunduk.kg/'

module.exports = {
  BASE_URL,
  API_URL,
  oidcConfig: {
    authority: ESI_URL,
    clientId: 'gartek',
    clientSecret: 'NEp0492yVIa4XPOhfqMKrvlhiYqiiV7X',
    redirectUri: `${BASE_URL}#/esi_login`,
    /*metadata: {
      // "userinfo_endpoint": "https://dev-esia.tunduk.kg/connect/userinfo",
      userinfo_endpoint: API_URL + 'oidc_login',
      "issuer": "https://dev-esia.tunduk.kg",
      "jwks_uri": "https://dev-esia.tunduk.kg/.well-known/openid-configuration/jwks",
      "authorization_endpoint": "https://dev-esia.tunduk.kg/connect/authorize",
      "token_endpoint": "https://dev-esia.tunduk.kg/connect/token",
      "end_session_endpoint": "https://dev-esia.tunduk.kg/connect/endsession",
      "check_session_iframe": "https://dev-esia.tunduk.kg/connect/checksession",
      "revocation_endpoint": "https://dev-esia.tunduk.kg/connect/revocation",
      "introspection_endpoint": "https://dev-esia.tunduk.kg/connect/introspect",
      "device_authorization_endpoint": "https://dev-esia.tunduk.kg/connect/deviceauthorization",
      "frontchannel_logout_supported": true,
      "frontchannel_logout_session_supported": true,
      "backchannel_logout_supported": true,
      "backchannel_logout_session_supported": true,
      "scopes_supported": ["openid", "profile", "organizations", "email", "phone", "device_api", "IdentityServerApi", "signature_api", "notification_api", "pki_srs_kg_create_user", "offline_access"],
      "claims_supported": ["sub", "citizenship", "pin", "name", "family_name", "given_name", "middle_name", "gender", "birthdate", "organizations", "email", "email_verified", "phone_number", "phone_number_verified"],
      "grant_types_supported": ["authorization_code", "client_credentials", "refresh_token", "implicit", "password", "urn:ietf:params:oauth:grant-type:device_code"],
      "response_types_supported": ["code", "token", "id_token", "id_token token", "code id_token", "code token", "code id_token token"],
      "response_modes_supported": ["form_post", "query", "fragment"],
      "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
      "id_token_signing_alg_values_supported": ["RS256"],
      "subject_types_supported": ["public"],
      "code_challenge_methods_supported": ["plain", "S256"],
      "request_parameter_supported": true,
    }*/

    metadata: {
    userinfo_endpoint: API_URL + 'oidc_login',
    // "userinfo_endpoint": "https://esia.tunduk.kg/connect/userinfo",
    "issuer": "https://esia.tunduk.kg",
    "jwks_uri": "https://esia.tunduk.kg/.well-known/openid-configuration/jwks",
    "authorization_endpoint": "https://esia.tunduk.kg/connect/authorize",
    "token_endpoint": "https://esia.tunduk.kg/connect/token",
    "end_session_endpoint": "https://esia.tunduk.kg/connect/endsession",
    "check_session_iframe": "https://esia.tunduk.kg/connect/checksession",
    "revocation_endpoint": "https://esia.tunduk.kg/connect/revocation",
    "introspection_endpoint": "https://esia.tunduk.kg/connect/introspect",
    "device_authorization_endpoint": "https://esia.tunduk.kg/connect/deviceauthorization",
    "frontchannel_logout_supported": true,
    "frontchannel_logout_session_supported": true,
    "backchannel_logout_supported": true,
    "backchannel_logout_session_supported": true,
    "scopes_supported": ["openid", "profile", "organizations", "email", "phone", "device_api", "IdentityServerApi", "signature_api", "notification_api", "pki_srs_kg_create_user", "offline_access"],
    "claims_supported": ["sub", "citizenship", "pin", "name", "family_name", "given_name", "middle_name", "gender", "birthdate", "organizations", "email", "email_verified", "phone_number", "phone_number_verified"],
    "grant_types_supported": ["authorization_code", "client_credentials", "refresh_token", "implicit", "password", "urn:ietf:params:oauth:grant-type:device_code"],
    "response_types_supported": ["code", "token", "id_token", "id_token token", "code id_token", "code token", "code id_token token"],
    "response_modes_supported": ["form_post", "query", "fragment"],
    "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
    "id_token_signing_alg_values_supported": ["RS256"],
    "subject_types_supported": ["public"],
    "code_challenge_methods_supported": ["plain", "S256"],
    "request_parameter_supported": true,
  }
  }
}