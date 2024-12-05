import React  from 'react'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './FirebaseRegister.css';
import { signup ,Login} from '../Firebase';
import axios from 'axios';
import { useUser } from '../SideItems/UserContext';


function FirebaseRegister({ isSidebarOpen,onSignupSuccess}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focusedName, setFocusedName] = useState(false);
    const [focusedEmail, setFocusedEmail] = useState(false);
    const [focusedPassword, setFocusedPassword] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const PassinputRef = useRef(null);
    const emailRef = useRef();
    const passwordRef = useRef();
    const { setUser } = useUser();


    const handleMoveLeft = () => {
        const textbox = document.getElementById('textbox');
        const toplam = document.querySelector('.toplam');
        textbox.style.transition = 'margin-left 1s ease';
        textbox.style.marginLeft = '0';
        toplam.style.transition = 'margin-left 1s ease';
        toplam.style.marginLeft = '100%';
    };

    const handleMoveRight = () => {
        const textbox = document.getElementById('textbox');
        const toplam = document.querySelector('.toplam');
        textbox.style.transition = 'margin-left 1s ease';
        textbox.style.marginLeft = '50%';
        toplam.style.transition = 'margin-left 1s ease';
        toplam.style.marginLeft = '0';
    };

  

async function signUp() {
    try {
        const item = { name, email, password };


        await axios.post("http://localhost:8081/signup", item);


        // Assuming signup is an async function that returns a promise
       const response= await signup(emailRef.current.value, passwordRef.current.value);
        setUser({ name: name, email: email });
    console.log(name ,email)
    localStorage.setItem('user', JSON.stringify({ name, email }));
        // If successful, navigate to "/Home"
        navigate("/Dashboard");
        
    } catch (error) {
        console.error("Error signing up:", error);
        // Handle error appropriately
    }
}


    // async function login() {
       
       
    //     let item = { email, password };
    //     await axios.get("http://localhost:8081/login", item);
    //      await Login(inputRef.current.value, PassinputRef.current.value);
    //     // onSignupSuccess(result.name);
    //     // console.log("name is:"+result.name);
    //     navigate("/ProductList"); 
    // }

    async function login() {
        try {
            let item = {
            
                email: inputRef.current.value,
                password: PassinputRef.current.value
            };
            console.log(item);
            const response = await axios.post("http://localhost:8081/login", item);
            await Login(inputRef.current.value, PassinputRef.current.value);
            setUser({ name: response.data.user.name, email: response.data.user.email });
            localStorage.setItem('user', JSON.stringify({ name: response.data.user.name, email: response.data.user.email }));
            
            console.log(response.data.user.name);
            navigate("/Dashboard");
        } catch (error) {
            console.error("Error logging in:", error);
        }
    }
    
    const handleNameFocus = () => {
        setFocusedName(true);
    };

    const handleNameBlur = () => {
        if (!name) {
            setFocusedName(false);
        }
    };

    const handleEmailFocus = () => {
        setFocusedEmail(true);
    };

    const handleEmailBlur = () => {
        if (!email) {
            setFocusedEmail(false);
        }
    };

    const handlePasswordFocus = () => {
        setFocusedPassword(true);
    };

    const handlePasswordBlur = () => {
        if (!password) {
            setFocusedPassword(false);
        }
    };

    useEffect(() => {

        const Userinput = inputRef.current;
        const passInput = PassinputRef.current

        const checkAutofill = () => {
            if (Userinput && passInput) {

                if (Userinput.matches(':-internal-autofill-selected')) {

                    setFocusedEmail(true);
                    clearTimeout(timeoutId);
                }
                if (passInput.matches(':-internal-autofill-selected')) {

                    setFocusedPassword(true);
                }

            }
        };
        const timeoutId = setInterval(checkAutofill, 50);

        // Clear input fields after a delay (20 seconds in this example)
        const timeout = setTimeout(() => {

            setEmail("");
            setPassword("");
        }, 20000); // 20 seconds delay

        return () => { clearTimeout(timeout); clearTimeout(timeoutId); } // Clear the timeout if the component unmounts
    }, []);
    return (
        <div className={`content ${isSidebarOpen ? '' : 'closed'}`}>
            <div id="fback">
                <div className="girisback"></div>
                <div className="kayitback"></div>
            </div>

            <div id="textbox">
                <div className="toplam">

                    <div className="left">
                        <div id="ic">
                            <h2 style={{ color: 'white' }}>Sign Up</h2>
                            <form id="girisyap" name="signup_form" method="post" enctype="multipart/form-data" onSubmit={(e) => e.preventDefault()}>


                                <div className={`form-group ${focusedName || name ? 'focused' : ''}`}>

                                    <label className="control-label" for="inputNormal">Name</label>
                                    <input
                                        type="text"
                                        name="signup_username"
                                        id="signup_username"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bp-suggestions form-control"
                                        cols="50"
                                        rows="10"
                                        autoComplete="username"
                                        onFocus={handleNameFocus}
                                        onBlur={handleNameBlur}
                                    />
                                </div>

                                <div className="form-group" style={{ width: '0px' }}>

                                </div>

                                <div className={`form-group ${focusedEmail || email ? 'focused' : ''}`}>

                                    <label className="control-label" htmlFor="signup_email">Email</label>
                                    <input
                                        type="text"
                                        name="signup_email"
                                        id="signup_email"
                                        value={email}
                                        ref={emailRef}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bp-suggestions form-control"
                                        cols="50"
                                        rows="10"
                                        autoComplete="email"
                                        onFocus={handleEmailFocus}
                                        onBlur={handleEmailBlur}
                                    />

                                </div>

                                <div className={`form-group ${focusedPassword || password ? 'focused' : ''}`}>
                                    <label className="control-label" htmlFor="signup_password">Password</label>
                                    <input
                                        type="password"
                                        name="signup_password"
                                        value={password}
                                        ref={passwordRef}
                                        onChange={(e) => setPassword(e.target.value)}
                                        id="signup_password"
                                        className="bp-suggestions form-control"
                                        cols="50"
                                        rows="10"
                                        autoComplete="new-password"
                                        onFocus={handlePasswordFocus}
                                        onBlur={handlePasswordBlur}
                                    />

                                </div>

                                <input type="submit" onClick={signUp} name="signup_submit" id="signup_submit" value="Sign Up" className="girisbtn" />

                            </form>
                            <button id='moveright' onClick={handleMoveRight} className="move-button">Already have an account?<i>Login</i> </button>

                        </div>
                    </div>

                    <div className="right">


                        <div id="ic">
                            <h2 style={{ marginBottom: '30px', marginLeft: '65px' }}>Login</h2>
                            <form name="login-form" id="girisyap" method="post" onSubmit={(e) => e.preventDefault()}>


                                <div className={`form-group ${focusedEmail || email ? 'focused' : ''}`}>
                                    <label className="control-label" htmlFor="log">Username</label>
                                    <input
                                        type="text"
                                        ref={inputRef}
                                        name="log"
                                        className="form-control"
                                        cols="50"
                                        rows="10"
                                        value={email}
                                       
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={handleEmailFocus}
                                        onBlur={handleEmailBlur}
                                        role="presentation" autocomplete="nope"
                                    />
                                </div>

                                <div className={`form-group ${focusedPassword || password ? 'focused' : ''}`}>

                                    <label className="control-label" for="inputNormal" >Password</label>
                                    <input
                                        type="password"
                                        name="pwd"
                                        ref={PassinputRef}
                                        className=" form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        cols="50"
                                        rows="10"
                                        onFocus={handlePasswordFocus}
                                        onBlur={handlePasswordBlur}
                                        role="presentation" autocomplete="nope" />
                                </div>


                                <input type="submit" onClick={login} value="Login" className="girisbtn" tabindex="100" />


                            </form>

                            <button id="moveleft" onClick={handleMoveLeft} className="move-button">Don't have already an account? <i>Signup</i></button>


                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default FirebaseRegister
