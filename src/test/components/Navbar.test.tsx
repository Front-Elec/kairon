import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { Navbar } from "@/components/layout/Navbar";
import { useAuthStore } from "@/store/authStore";

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("oculta las rutas de admin para un usuario estándar", () => {
    useAuthStore.setState({
      session: { username: "usuario", role: "usuario" },
      hasHydrated: true,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getAllByText("usuario")).toHaveLength(2);
    expect(screen.getByText("Catálogo")).toBeInTheDocument();
    expect(screen.queryByText("Préstamos")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    expect(screen.queryByText("Estadísticas")).not.toBeInTheDocument();
  });

  it("muestra nombre, rol y rutas administrativas para admin", () => {
    useAuthStore.setState({
      session: { username: "admin", role: "admin" },
      hasHydrated: true,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getAllByText("admin")).toHaveLength(2);
    expect(screen.getByText("Préstamos")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Estadísticas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cerrar sesión/i })).toBeInTheDocument();
  });

  it("cierra la sesión y limpia el store al hacer logout", async () => {
    const user = userEvent.setup();

    useAuthStore.setState({
      session: { username: "admin", role: "admin" },
      hasHydrated: true,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /cerrar sesión/i }));

    expect(useAuthStore.getState().session).toBeNull();
  });
});
