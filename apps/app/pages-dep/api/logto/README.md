## Auth Flow

The migration api endpoint is used to create a V2Account model for any new or previous V1 user accounts.

The usermeta api endpoint is only used to retrieve extra user data which is then piped into the session object ihe logto utils file.

The flow goes as so

User Presses sign-in button ->

Redirected to logto authorization server (localhost:3001) ->

User logs in with logto service ->

Logto redirects to the sign-in-callback api endpoint ->

Sign-in-callback api endpoint redirects to migration endpoint after it completes it's internal logic ->

Finally migration endpoint redirects to "/" page.
  