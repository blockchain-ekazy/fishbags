import "./App.css";
import React, { Component, useState, useEffect } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

import abi from "./abi.json";
const contracts = {
  "0x4": "0xA75D36C98463Cd8444117E12577962f4378DDF11", //eth
  "0x13881": "0x5ae555a6738f9eCC68eEF3060B7CABbdD0AAf45a", //polygon
  "0x45": "0x856A3439C211a3A8CE2f102Bc71fF5035fe50AF5", //optimism
  "0x66eeb": "0xD9bA57d5FCaf091bf5c1c8eaECB23533648fb5DA", //arbitrum
};

function App() {
  const [userAddress, setUserAddress] = useState("connect wallet");
  const [walletFound, setWalletFound] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    initializeWeb3();
  }, []);

  async function initializeWeb3() {
    if (await detectEthereumProvider()) {
      setWalletFound(true);

      window.web3 = new Web3(window.ethereum);
      const web3 = window.web3;
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      if (!contracts[chainId]) {
        console.log("Unsupported Network");
        return;
      }

      let metaMaskAccount = await web3.eth.getAccounts();
      metaMaskAccount = metaMaskAccount[0];

      const ct = new web3.eth.Contract(abi, contracts[chainId]);
      setBalance(await ct.methods.balanceOf(metaMaskAccount).call());
    }
  }

  window.ethereum.on("chainChanged", (chainId) => {
    initializeWeb3();
  });

  const connectWallet = async () => {
    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      // const web3 = window.web3;
      // let metaMaskAccount = await web3.eth.getAccounts();
      // metaMaskAccount = metaMaskAccount[0];

      // setUserAddress(
      //   String(metaMaskAccount).substring(0, 7) +
      //     "..." +
      //     String(metaMaskAccount).substring(35, 42)
      // );
      setUserAddress("connected");
    } else {
      alert("Ethereum supported wallet not found");
    }
  };

  const mint = async (chainId, name) => {
    window.web3 = new Web3(window.ethereum);
    const web3 = window.web3;

    if (chainId != (await window.ethereum.request({ method: "eth_chainId" }))) {
      alert("Enable " + name + " Network!");
      return;
    }
    if (!contracts[chainId]) {
      console.log("Unsupported Network");
      return;
    }

    let metaMaskAccount = await web3.eth.getAccounts();
    metaMaskAccount = metaMaskAccount[0];

    const ct = new web3.eth.Contract(abi, contracts[chainId]);
    try {
      await ct.methods.mint(0, 1).send({ from: metaMaskAccount });
    } catch (error) {
      console.log(error);
    }

    initializeWeb3();
  };

  return (
    <React.Fragment>
      <header>
        <div class="container">
          <div class="logo">
            <a href="" class="col-white vt323">
              fishbags
            </a>
          </div>

          <div class="nav-actions">
            <a href="">
              <img src="images/header-icon1.png" />
            </a>
            <a href="">
              <img src="images/header-icon2.png" />
            </a>
            <a href="">
              <img src="images/header-icon3.png" />
            </a>
          </div>

          <div class="navbar-handler">
            <img src="images/hamburger.png" />
          </div>

          <div class="navbar-custom">
            <div class="menu-item">
              <a href=""> mint </a>
            </div>

            <div class="menu-item">
              <a href=""> play </a>
            </div>

            <div class="menu-item">
              <a href=""> leaderboard </a>
            </div>

            <div class="menu-btn">
              <a class="vt323" onClick={connectWallet}>
                {userAddress}
              </a>
            </div>
          </div>
        </div>
      </header>

      <div class="page-content">
        <div class="container">
          <div class="block-element">
            <div class="banner-1">
              <img src="images/main-banner.png" />
            </div>
          </div>

          <div class="block-element">
            <div class="row">
              <div class="col-md-8 col-lg-8 col-sm-12 col-12 sec-wid-left">
                <div class="wrapper-1">
                  <div class="custom-block2  m-b-30">
                    <div class="sec-head2">
                      <h4 class="col-white vt323"> fishbags </h4>
                    </div>
                    <div class="textual-block2 inter">
                      <h4 class="col-black"> 4 chains </h4>
                      <h4 class="col-black"> 4000 fishbags </h4>
                      <h4 class="col-black">no discord, no roadmap, no BS.</h4>
                    </div>
                  </div>
                </div>

                <div class="wrapper-3">
                  <div class="custom-block2 m-b-30">
                    <div class="sec-head3 text-center">
                      <h4 class="col-white vt323 "> mint fishbags </h4>
                    </div>
                    <div class="wrapper-2">
                      <div class="block-element m-b-30">
                        <div class="step-form ">
                          <div class="step-form-head">
                            <a href="https://metamask.io/download.html">
                              <button
                                class="custom-btn2 vt323"
                                disabled={walletFound}
                              >
                                <span>download wallet</span>
                              </button>
                            </a>
                          </div>
                          <div class="step-form-data epilogue">
                            <form>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" /> Download
                                Metamask
                              </label>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" /> Create a
                                Wallet
                              </label>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" /> Deposit Funds
                              </label>
                            </form>
                          </div>
                        </div>
                      </div>

                      <div class="block-element  m-b-30">
                        <div class="step-form">
                          <div class="step-form-head">
                            <button
                              class="custom-btn2 vt323"
                              onClick={connectWallet}
                              disabled={userAddress == "connected"}
                            >
                              <span> {userAddress} </span>
                            </button>
                          </div>
                          <div class="step-form-data epilogue">
                            <form>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" /> Connect
                                Metamask Wallet
                              </label>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" /> Select
                                Blockchain Network
                              </label>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" /> Mint fishbags
                              </label>
                            </form>
                          </div>
                        </div>
                      </div>

                      <div class="block-element m-b-30">
                        <div class="step-form">
                          <div class="step-form-head">
                            <button class="custom-btn2 vt323" disabled>
                              <span> mint fishbag </span>
                            </button>
                            <br />
                            <br />
                            <button
                              class="custom-btn2 vt323"
                              onClick={() => mint("0x4", "Ethereum")}
                            >
                              <span> eth </span>
                            </button>
                            <button
                              class="custom-btn2 vt323"
                              onClick={() => mint("0x13881", "Polygon")}
                            >
                              <span> poly </span>
                            </button>
                            <button
                              class="custom-btn2 vt323"
                              onClick={() => mint("0x45", "Optimism")}
                            >
                              <span> opt </span>
                            </button>
                            <button
                              class="custom-btn2 vt323"
                              onClick={() => mint("0x66eeb", "Arbitrum")}
                            >
                              <span> arby </span>
                            </button>
                          </div>
                          <div class="step-form-data epilogue">
                            <form>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" /> Open Metamask
                                Wallet
                              </label>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" /> View fishbags
                                NFT
                              </label>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" /> Let's play
                                fishbags!
                              </label>
                            </form>
                          </div>
                        </div>
                      </div>

                      <div class="block-element text-center m-b-30">
                        <button
                          class="vt323 custom-btn1"
                          disabled={balance == 0}
                        >
                          <span> play fishbags </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-8 col-lg-8 col-sm-12 col-12 sec-wid-right">
                <div class="block-element">
                  <div class="custom-block3 m-b-30">
                    <div class="sec-head2">
                      <h4 class="col-white vt323"> about fishbags </h4>
                    </div>

                    <form>
                      <div class="content-block2">
                        <div class="block-element m-b-30">
                          <div class="form-head">
                            <h3 class="col-black vt323">
                              omnichain <i class="fa fa-caret-up"> </i>
                            </h3>
                          </div>
                          <div class="form-content">
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> ethereum,
                              arbitrum, polygon, optimism
                            </label>
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> improved
                              liquidity
                            </label>
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> mass
                              accessibility
                            </label>
                          </div>
                        </div>

                        <div class="block-element m-b-30">
                          <div class="form-head">
                            <h3 class="col-black vt323">
                              game <i class="fa fa-caret-up"> </i>
                            </h3>
                          </div>
                          <div class="form-content ">
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> simple, fun,
                              funky
                            </label>
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> html5, no app
                              required
                            </label>
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> cross-platform
                              compatiblitlity
                            </label>
                          </div>
                        </div>

                        <div class="block-element m-b-30">
                          <div class="form-head">
                            <h3 class="col-black vt323">
                              sound fx<i class="fa fa-caret-up"> </i>
                            </h3>
                          </div>
                          <div class="form-content ">
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> algobeats
                            </label>
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> smacking beats
                            </label>
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> grassroots sound
                              fx
                            </label>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="custom-block2  m-b-30">
                    <div class="sec-head2">
                      <h4 class="col-white vt323"> fishbags leaderboard </h4>
                    </div>
                    <div class="textual-block2 inter">
                      <h4 class="col-black"> Top 10 </h4>
                      <h4 class="col-black"> </h4>
                      <h4 class="col-black"> </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="block-element">
            <div class="custom-block1">
              <div class="sec-head">
                <h3 class="col-white vt323"> fishbags design </h3>
              </div>

              <div class="content-block1">
                <div class="textual-block1 inter">
                  <h4 class="col-black1"> fishbags lib: </h4>
                  <p class="col-white"> connect wallet, view your fishbags </p>
                </div>

                <div class="block-element">
                  <div class="form-1 inter">
                    <form>
                      <div class="row">
                        <div class="col-md-6 col-lg-6 col-sm-6 col-12">
                          <div class="form-field1">
                            <input
                              type="text"
                              placeholder="fish"
                              class="field-style1"
                              name=""
                            />
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-6 col-sm-6 col-12">
                          <div class="form-field1">
                            <input
                              type="text"
                              placeholder="bubbles"
                              class="field-style1"
                              name=""
                            />
                          </div>
                        </div>

                        <div class="col-md-6 col-lg-6 col-sm-6 col-12">
                          <div class="form-field1">
                            <input
                              type="text"
                              placeholder="bag"
                              class="field-style1"
                              name=""
                            />
                          </div>
                        </div>

                        <div class="col-md-6 col-lg-6 col-sm-6 col-12">
                          <div class="form-field1">
                            <input
                              type="text"
                              placeholder="accessory"
                              class="field-style1"
                              name=""
                            />
                          </div>
                        </div>

                        <div class="col-md-6 col-lg-6 col-sm-6 col-12">
                          <div class="form-field1">
                            <input
                              type="text"
                              placeholder="liquid"
                              class="field-style1"
                              name=""
                            />
                          </div>
                        </div>

                        <div class="col-md-6 col-lg-6 col-sm-6 col-12">
                          <div class="form-field1">
                            <input
                              type="text"
                              placeholder="background"
                              class="field-style1"
                              name=""
                            />
                          </div>
                        </div>

                        <div class="col-md-12 col-lg-12 col-sm-12 col-12">
                          <h5 class="info-tag1 col-black">
                            <b> Disclaimer: </b> There are some (not many) rare
                            fishbags that exist with unique qualities, congrats
                            if you get one!
                          </h5>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
