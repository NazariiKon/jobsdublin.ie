import { useGoogleLogin } from "@react-oauth/google";

export const useGoogleAuth = (onGoogleData: (data: any) => void) => {
  return useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const data = await res.json();
        onGoogleData(data);
      } catch (error) {
        console.error("Error fetching Google user info", error);
      }
    },
    onError: (error) => {
      console.error("Google Login Failed", error);
    },
    scope: "openid email profile",
  });
};