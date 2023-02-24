import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import * as faceapi from "face-api.js";
import "./signup.css";


const Signup = () => {
	// Get the Data from the form
	const [fname, setFname] = useState("");
	const [lname, setLname] = useState("");
	const [username, setUser] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [Id, setId] = useState("");
	// data for face Detect 
	const [leftPic, setLeftPic] = useState(null);
	const [rightPic, setRightPic] = useState(null);
	const [frontPic, setFrontPic] = useState(null);
	const webcamRef = useRef(null);
	const [isCameraOn, setIsCameraOn] = useState(true);
	const videoConstraints = {
		width: 320,
		height: 320,
		facingMode: "user",
	};
	// Generate a New ID 
	const generateId = () => {
		const randomId = Math.floor(Math.random() * 1000);
		setId(randomId);
	};
	// Detect for Different first name and generate Random Id for each Person
	const handleNameChange = (event) => {
		setFname(event.target.value);
		generateId();
	};
	//  load face-api models
	const loadModels = () => {
		return Promise.All([
			faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
			faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
			faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
		]);
	};
	// 	capture left face 
	const handleLeftFace = async () => {
		if (isCameraOn) {
			setIsCameraOn(true);
			await loadModels();
			const canvas = document.createElement('canvas');
			const video = Webcam.Ref.current.video;
			canvas.width = video.width;
			canvas.height = video.height;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			const leftFaceImg = canvas.toDataURL('image/png');
			setIsCameraOn(true);
			setLeftPic(leftFaceImg);
		};
	};
	// capture right face 
	const handleRightFace = async () => {
		if (isCameraOn) {
			setIsCameraOn(true);
			await loadModels();
			const canvas = document.createElement('canvas');
			const video = webcamRef.current.video;
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			const rightFaceImg = canvas.toDataURL('image/png');
			setRightPic(rightFaceImg);
		};
	};
	// capture front face 
	const handleFrontFace = async () => {
		if (isCameraOn) {
			setIsCameraOn(true);
			await loadModels();
			const canvas = document.createElement('canvas');
			const video = webcamRef.current.video;
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			const frontFaceImg = canvas.toDataURL('image/png');
			setFrontPic(frontFaceImg);
		}
	}

	// save data locally and to the server 
	const saveData = () => {
		const data = {
			id: Id,
			firstName: fname,
			leftSelfie: leftPic,
			rightSelfie: rightPic,
			frontSelfie: frontPic,
		};
		const dataLocal = {
			firstName: fname,
			lastName: lname,
			userName: username,
			email: email,
			password: password,
		};
		// Save data locally and on server 
		try {
			localStorage.setItem('formData', JSON.stringify(dataLocal));
			axios.post('', data);

			alert("Data Saved Succesfully");
		} catch {
			console.log("Error");
			alert("Error Saving Data");
		}


	};

	return (
		<div className="main">
			<div className="container">
				<div className="title"> Register </div>
				<div className="sub-title">Please enter your details below.</div>
				<form action="#" >
					<div className="user-details">
						<div className="input-box">
							<label htmlFor="First Name" className="details">First Name</label>
							<input type="text" name="FirstName" id="FirstName" placeholder="Enter Your Name" value={fname} onChange={handleNameChange} required />
						</div>
						<div className="input-box">
							<label htmlFor="Last Name" className="details">Last Name</label>
							<input type="text" name="LastName" id="LastName" placeholder="Enter Your Last Name" value={lname} onChange={(e) => setLname(e.target.value)} required />
						</div>
						<div className="input-box">
							<label htmlFor="Username" className="details">Username</label>
							<input type="text" name="Username" id="Username" placeholder="Enter Your Username" value={username} onChange={(e) => setUser(e.target.value)} required />
						</div>
						<div className="input-box">
							<label htmlFor="Email" className="details">Email</label>
							<input type="text" name="Email" id="Email" placeholder="Enter Your Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</div>
						<div className="input-box">
							<label htmlFor="Password" className="details">Password</label>
							<input type="text" name="password" id="password" placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
						</div>
						<div className="face_detect">
							<button className="left_face" onClick={() => handleLeftFace(true)}>LeftFace</button>
							<button className="right_face" onClick={() => handleRightFace()}>RightFace</button>
							<button className="front_face" onClick={() => handleFrontFace()}>FrontFace</button>
						</div>

						{isCameraOn && (
							<Webcam
								audio={true}

								ref={webcamRef}
								screenshotFormat="image/jpeg"

								videoConstraints={videoConstraints}

							/>
						)};
						<button type="submit" className="button" onClick={saveData}>Register</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Signup;