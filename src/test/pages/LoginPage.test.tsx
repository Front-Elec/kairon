import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { LoginPage } from "@/pages/LoginPage";
import { useAuthStore } from "@/store/authStore";

describe("LoginPage", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ session: null, hasHydrated: true });
  });

  it("muestra error cuando las credenciales son incorrectas", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/usuario/i), "admin");
    await user.type(screen.getByLabelText(/contraseña/i), "fallida");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(useAuthStore.getState().session).toBeNull();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Credenciales incorrectas. Verifica tu usuario y contraseña."
    );
  });

  it("actualiza el store con role admin cuando las credenciales son correctas", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<p>Catálogo</p>} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/usuario/i), "admin");
    await user.type(screen.getByLabelText(/contraseña/i), "admin123");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(useAuthStore.getState().session).toEqual({
      username: "admin",
      role: "admin",
    });
  });

  it("actualiza el store con role usuario cuando las credenciales son correctas", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<p>Catálogo</p>} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/usuario/i), "usuario");
    await user.type(screen.getByLabelText(/contraseña/i), "usuario123");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(useAuthStore.getState().session).toEqual({
      username: "usuario",
      role: "usuario",
    });
  });

  it("redirige al destino original después de iniciar sesión", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/login", state: { from: { pathname: "/admin" } } },
        ]}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<p>Panel administrativo</p>} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/usuario/i), "admin");
    await user.type(screen.getByLabelText(/contraseña/i), "admin123");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(screen.getByText("Panel administrativo")).toBeInTheDocument();
  });
});
