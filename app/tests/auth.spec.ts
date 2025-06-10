import { expect, test, describe } from "vitest";
import axios from "axios";

const TEST_BASE_URL = "http://localhost:3000";
const TIMEOUT = 10000;

describe("Auth Route Tests", () => {
  // Test that unauthorized access to protected routes redirects to auth
  test(
    "should redirect to auth when accessing protected routes",
    async () => {
      try {
        const response = await axios.get(`${TEST_BASE_URL}/home`, {
          timeout: TIMEOUT,
          maxRedirects: 0,
          validateStatus: function (status) {
            return true;
          },
        });

        // Should redirect to auth page
        if (response.status === 302) {
          expect(response.headers.location).toMatch(/auth/);
        } else if (response.status === 200) {
          // If not redirected, check if it's the auth page content
          expect(response.data).toMatch(/Login|Register|Authentication/i);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Protected route test failed:", error.message);
        }
        throw error;
      }
    },
    TIMEOUT
  );

  test(
    "should load auth page successfully",
    async () => {
      try {
        const response = await axios.get(`${TEST_BASE_URL}/auth`, {
          timeout: TIMEOUT,
          maxRedirects: 0,
          validateStatus: function (status) {
            return true;
          },
        });
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/text\/html/);
        expect(response.data).toMatch(/Login|Register|Authentication/i);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Request failed:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });
        }
        throw error;
      }
    },
    TIMEOUT
  );

  // Test POST request to login endpoint
  test(
    "should handle login form submission with wrong password",
    async () => {
      const loginData = new FormData();
      loginData.append("formType", "login");
      loginData.append("email", "test@example.com");
      loginData.append("password", "testpassword123");

      try {
        const response = await axios.post(`${TEST_BASE_URL}/auth`, loginData, {
          timeout: TIMEOUT,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          maxRedirects: 0,
          validateStatus: function (status) {
            return true;
          },
        });

        // user does not exist
        expect([200]).toContain(response.status);

        if (response.status === 302) {
          expect(response.headers.location).toBeDefined();
        } else if (response.status === 200) {
          expect(response.data).toMatch(/Login|Register|Authentication/i);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Login request failed:", {
            message: error.message,
            status: error.response?.status,
          });
        }
        throw error;
      }
    },
    TIMEOUT
  );

  test(
    "should handle register form submission",
    async () => {
      const registerData = new FormData();
      registerData.append("formType", "register");
      registerData.append("username", "testuser");
      registerData.append("email", "newuser@example.com");
      registerData.append("password", "testpassword123");

      try {
        const response = await axios.post(
          `${TEST_BASE_URL}/auth`,
          registerData,
          {
            timeout: TIMEOUT,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            maxRedirects: 0,
            validateStatus: function (status) {
              return true;
            },
          }
        );

        expect([302]).toContain(response.status);

        if (response.status === 302) {
          expect(response.headers.location).toBeDefined();
        } else if (response.status === 200) {
          expect(response.data).toMatch(/Login|Register|Authentication/i);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Register request failed:", {
            message: error.message,
            status: error.response?.status,
          });
        }
        throw error;
      }
    },
    TIMEOUT
  );

  test(
    "should handle login form submission",
    async () => {
      const loginData = new FormData();
      loginData.append("formType", "login");
      loginData.append("email", "newuser@example.com");
      loginData.append("password", "testpassword123");

      try {
        const response = await axios.post(`${TEST_BASE_URL}/auth`, loginData, {
          timeout: TIMEOUT,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          maxRedirects: 0,
          validateStatus: function (status) {
            return true;
          },
        });

        // user exists
        expect([302]).toContain(response.status);

        if (response.status === 302) {
          expect(response.headers.location).toBeDefined();
        } else if (response.status === 200) {
          expect(response.data).toMatch(/Login|Register|Authentication/i);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Login request failed:", {
            message: error.message,
            status: error.response?.status,
          });
        }
        throw error;
      }
    },
    TIMEOUT
  );
});