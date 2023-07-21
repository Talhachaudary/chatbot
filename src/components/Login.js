import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContextApi";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, googlesignin } = useUserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (email == "admin@gmial.com") {
        await login(email, password);
      navigate("/admin");
      } else {
        await login(email, password);
        navigate("/home");
      }
      
    } catch (error) {
      setError(error.message);
    }
  };
  const handleGoogleSignin = async (e) => {
    e.preventDefault();
    try {
      await googlesignin();
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Container
        style={{
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
        }}
      >
        <h2 className="text-center my-2">Chat Bot Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <hr />
        <div className="p-4 box">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {/* Input FIelds Email */}
              <Form.Control
                type="email"
                placeholder="Email address"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              {/* Input FIelds Password */}
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="Submit">
                Log In
              </Button>
            </div>
          </Form>
          <hr />
          <div className="text-center">
            <GoogleButton
              className="g-btn"
              type="dark"
              onClick={handleGoogleSignin}
            />
          </div>
        </div>
        <div className="p-4 box mt-3 text-center">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </Container>
    </div>
  );
};

export default LoginForm;
