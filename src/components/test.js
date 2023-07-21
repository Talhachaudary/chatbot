import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Test() {
  const hanldeAddCollection = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const hanldeGetCollection = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    // console.log(querySnapshot)
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  };
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Row>
        <Col>
          <h1>This is the test component</h1>
          <Button onClick={hanldeAddCollection}>Add Collection</Button>
          <Button onClick={hanldeGetCollection}>Get Collection</Button>
        </Col>
      </Row>
    </Container>
  );
}
