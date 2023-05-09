local claims = {
  email_verified: false,
} + std.extVar('claims');

{
  identity: {
    traits: {
      // Allowing unverified email addresses enables account
      // enumeration attacks, if the value is used for
      // verification or as a password login identifier.
      //
      // Therefore we only return the email if it (a) exists and (b) is marked verified
      // by Twitch.
      [if 'email' in claims && claims.email_verified then 'email' else null]: claims.email,
      name: claims.display_name,
      image: claims.profile_image_url,
    },
  },
  metadata_public: {
      provider: "twitch",
      provider_id: claims.sub,
      role: "USER",
  },
}
