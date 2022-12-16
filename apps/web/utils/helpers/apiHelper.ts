const api_url = 'http://localhost:4500/';
const handleUploadFileLogic = async (
  url: string | undefined,
  userId: string | number,
  type: string,
) => {
  let result;
  const options = {
    method: 'POST',
    body: JSON.stringify({ id: userId, url: url, type: type }),
    headers: { 'Content-Type': 'application/json' },
  };
  try {
    const request = await fetch(api_url + 'footage', options);
    const response = await request.json();

    if (response.error) {
      result = { message: response.error.message, error: true };
    } else {
      result = {
        message: response.data.message,
      };
    }
  } catch (error) {
    console.log(error);
    result = {
      message:
        'Sorry, but our server seems to be down. Please try again later.',
      error: true,
    };
  }
  return result;
};

const checkURL = (url: string): boolean => {
  const p =
    // eslint-disable-next-line max-len
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return true;
  }
  return false;
};

const getYtVidDataFromId = async (videoId: string) => {
  console.log('ran');
  const baseUrl =
    'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=';
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const url = baseUrl + videoId + '&key=' + `${process.env.YOUTUBE_API_KEY}`;
  try {
    const request = await fetch(url, options);
    const res = await request.json();
    return res.items[0].snippet;
  } catch (error) {
    throw new Error('Error Fetching');
  }
};

export { handleUploadFileLogic, checkURL, getYtVidDataFromId };
