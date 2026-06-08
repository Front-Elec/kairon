import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ session: null, hasHydrated: true });
  });

  it("renderiza el contenido para un admin en ruta protegida de admin", () => {
    useAuthStore.setState({
      session: { username: "admin", role: "admin" },
      hasHydrated: true,
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<p>Panel administrativo</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Panel administrativo")).toBeInTheDocument();
  });

  it("redirige a / cuando un usuario intenta entrar a una ruta de admin", () => {
    useAuthStore.setState({
      session: { username: "usuario", role: "usuario" },
      hasHydrated: true,
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/" element={<p>Catálogo principal</p>} />
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<p>Panel administrativo</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Catálogo principal")).toBeInTheDocument();
    expect(screen.queryByText("Panel administrativo")).not.toBeInTheDocument();
  });
});
