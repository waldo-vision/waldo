local claims = {
  email_verified: true,
} + std.extVar('claims');

{
  identity: {
    traits: {
      [if 'email' in claims && claims.email_verified then 'email' else null]: claims.email,
      name: claims.given_name +" "+claims.family_name,
      image: claims.picture,
    },
  },
  metadata_public: {
      provider: "google",
      provider_id: claims.sub,
      role: "USER",
    },
}
