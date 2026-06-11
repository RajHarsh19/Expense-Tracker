// LoginPage.js
import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { email, password } = values;

      if (!email || !password) {
        toast.error("Please enter all fields", toastOptions);
        return;
      }

      setLoading(true);

      console.log("Login API:", loginAPI);

      const response = await axios.post(
        loginAPI,
        {
          email: email.trim().toLowerCase(),
          password,
        },
        {
          timeout: 15000,
        }
      );

      console.log("Login Response:", response.data);

      const data = response.data;

      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        toast.success(
          data.message || "Login successful",
          toastOptions
        );

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(
          data.message || "Invalid credentials",
          toastOptions
        );
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error.response) {
        console.log(
          "Server Response:",
          error.response.data
        );

        toast.error(
          error.response.data.message ||
            "Login failed",
          toastOptions
        );
      } else if (error.request) {
        toast.error(
          "Cannot connect to server",
          toastOptions
        );
      } else {
        toast.error(
          "Something went wrong",
          toastOptions
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async () => {}, []);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#000",
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 50,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#ffcc00",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.5,
              random: true,
            },
            size: {
              value: 3,
              random: {
                enable: true,
                minimumValue: 1,
              },
            },
            links: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 2,
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <Container
        className="mt-5"
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <h1 className="text-center mt-5">
              <AccountBalanceWalletIcon
                sx={{
                  fontSize: 40,
                  color: "white",
                }}
              />
            </h1>

            <h2 className="text-white text-center">
              Login
            </h2>

            <Form onSubmit={handleSubmit}>
              <Form.Group
                controlId="formBasicEmail"
                className="mt-3"
              >
                <Form.Label className="text-white">
                  Email Address
                </Form.Label>

                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group
                controlId="formBasicPassword"
                className="mt-3"
              >
                <Form.Label className="text-white">
                  Password
                </Form.Label>

                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                />
              </Form.Group>

              <div
                className="mt-4"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Link
                  to="/forgotPassword"
                  className="text-white lnk"
                >
                  Forgot Password?
                </Link>

                <Button
                  type="submit"
                  className="mt-3 btnStyle"
                  disabled={loading}
                >
                  {loading
                    ? "Signing In..."
                    : "Login"}
                </Button>

                <p
                  className="mt-3"
                  style={{
                    color: "#9d9494",
                  }}
                >
                  Don't Have an Account?{" "}
                  <Link
                    to="/register"
                    className="text-white lnk"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>

        <ToastContainer />
      </Container>
    </div>
  );
};

export default Login;
