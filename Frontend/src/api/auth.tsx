import type { components } from "@/types/api";

export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/login/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.access_token);
      return { success: true };
    } else {
      return { success: false, error: data.detail || "Unknown error" };
    }
  } catch (error) {
    console.error("Server error: ", { error });
    return { success: false, error: error || "Unknown error" };
  }
};

export async function google_auth(data: any) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const result = await response.json()
    if (response.ok) {
      localStorage.setItem("token", result.access_token);
      return { success: true };
    }
    else {
      return { success: false, error: result.detail || "Unknown error" };
    }
  }
  catch (error) {
    console.error("Server error: ", { error });
    return { success: false, error: error || "Unknown error" };
  }
};

export async function signup(email: string, password: string) {
  const data = {
    email: email,
    password: password
  }
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/create_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    const result = await response.json()
    if (response.ok) {
      return { success: true };
    }
    else {
      return { success: false, error: result.detail || "Unknown error" };
    }
  }
  catch (error) {
    console.error("Server error: ", { error });
    return { success: false, error: error || "Unknown error" };
  }

};

export async function employer_signup(data: Record<string, any>) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/create_employer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem("token", result.token.access_token);
      return { success: true };
    } else {
      let errorMessage = "Unknown error";
      if (result.detail) {
        if (Array.isArray(result.detail)) {
          errorMessage = result.detail.map((err: any) => err.msg).join(", ");
        } else if (typeof result.detail === "string") {
          errorMessage = result.detail;
        }
      }
      return { success: false, error: errorMessage };
    }

  } catch (error: any) {
    console.error("Server error: ", { error });
    return { success: false, error: error.message || "Unknown error" };
  }
};

type User = components['schemas']['UserRead'];

type GetCurrentUserResult =
  | { success: true; user: User }
  | { success: false; error: string };

export async function get_current_user(): Promise<GetCurrentUserResult> {
  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false, error: "Auth error" };
  }

  try {
    const result = await fetch(`${import.meta.env.VITE_API_URL}/login/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (result.status === 401) {
      localStorage.removeItem("token");
      return { success: false, error: "Unauthorized" };
    }

    if (!result.ok) {
      throw new Error(`Error: ${result.status}`);
    }

    const data = (await result.json()) as User;
    return { success: true, user: data };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "Unknown error" };
  }
}
