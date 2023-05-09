local claims = {
  email_verified: false,
} + std.extVar('claims');

{
  identity: {
    traits: {
      // Allowing unverified email addresses enables account
      // enumeration attacks, especially if the value is used for
      // e.g. verification or as a password login identifier.
      //
      // Therefore we only return the email if it (a) exists and (b) is marked verified
      // by GitHub.
      email: "battlenet@nomail.example", //battlenet has no email
      name: claims.battletag, //only thing you get is battletag
      image: "https://waldo.vision/battle_net.png", //this will break if image gets removed
    },
    metadata_public: {
      provider: "battlenet",
      provider_id: claims.sub,
      role: "USER",
    },
  },
}
