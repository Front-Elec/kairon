import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "../../store/authStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ session: null, hasHydrated: true });
  });

  it("guarda una sesión admin con credenciales correctas", () => {
    const result = useAuthStore.getState().login("admin@kairon.com", "admin123");

    expect(result).toBe(true);
    expect(useAuthStore.getState().session).toEqual({
      username: "admin",
      role: "admin",
    });
  });

  it("guarda una sesión usuario con credenciales correctas", () => {
    const result = useAuthStore.getState().login("usuario1@kairon.com", "usuario123");

    expect(result).toBe(true);
    expect(useAuthStore.getState().session).toEqual({
      username: "Laura",
      role: "usuario",
    });
  });

  it("no cambia el store con credenciales incorrectas", () => {
    const result = useAuthStore.getState().login("admin@kairon.com", "incorrecta");

    expect(result).toBe(false);
    expect(useAuthStore.getState().session).toBeNull();
  });

  it("logout limpia la sesión activa", () => {
    useAuthStore.setState({
      session: { username: "admin", role: "admin" },
      hasHydrated: true,
    });

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().session).toBeNull();
  });
});
