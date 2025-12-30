import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            // 🔍 DEBUG CLAVE
            console.log("RESPUESTA LOGIN:", data);

            if (!response.ok) {
                setError(data.message || "Error al iniciar sesión");
                return;
            }

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: data.id,
                    nombre: data.nombre,
                    email: data.email,
                    rol: data.rol
                })
            );


            navigate("/dashboard");

        } catch (err) {
            setError("No se pudo conectar con el servidor");
        }
    };

    return (
        <div>
            <h2>Iniciar sesión</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label>Contraseña</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;
