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