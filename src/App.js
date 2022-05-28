import "./custom.css";
import "./App.css";
import React, { Component, useState, useEffect } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { toast } from "react-toastify";

import { networks } from "./networks";
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
        toast.error("Unsupported Network");
        return;
      }

      let metaMaskAccount = await web3.eth.getAccounts();
      metaMaskAccount = metaMaskAccount[0];

      const ct = new web3.eth.Contract(abi, contracts[chainId]);
      setBalance(await ct.methods.balanceOf(metaMaskAccount).call());
    }
  }

  try {
    window.ethereum.on("chainChanged", (chainId) => {
      initializeWeb3();
    });
  } catch (error) {
    // console.log(error);
  }

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
      toast.error("Ethereum supported wallet not found");
    }
  };

  const changeNetwork = async (networkName) => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      if (networkName != "Ethereum")
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networks[networkName],
            },
          ],
        });
      else
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x4" }],
        });
    } catch (err) {
      toast.error(err);
    }
  };

  const mint = async (chainId, name) => {
    window.web3 = new Web3(window.ethereum);
    const web3 = window.web3;

    await changeNetwork(name);

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
            <h1 href="" class="col-white vt323">
              <img src="images/fishbag.png" /> fishbags
            </h1>
          </div>
          <div class="nav-actions">
            <br />
            <button
              class="custom-btn2 vt323"
              onClick={connectWallet}
              type="button"
              disabled={userAddress == "connected"}
            >
              <span> {userAddress} </span>
            </button>
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
                      <h4 class="col-white vt323"> tl;dr </h4>
                    </div>
                    <div class="textual-block2 inter">
                      <h5 class="checkbox-label1">
                        <input type="checkbox" name="" /> 4 chains -
                        <b>ETH, POLY, ARB, OPT</b>
                      </h5>
                      <h5 class="checkbox-label1">
                        <input type="checkbox" name="" /> 4000 fishbags
                      </h5>
                      <h4 class="checkbox-label1">
                        <input type="checkbox" name="" /> no discord, no DAO,
                        just mint & play
                      </h4>
                    </div>
                  </div>
                </div>

                <div class="block-element d-lg-none d-md-none">
                  <div class="custom-block2  m-b-30">
                    <div class="sec-head2">
                      <h4 class="col-white vt323"> fishbags leaderboard </h4>
                    </div>
                    <div class="textual-block2 inter">
                      <h4 class="col-black"> top 10 </h4>
                      <h4 class="col-black"> </h4>
                      <h4 class="col-black"> </h4>
                    </div>
                  </div>
                </div>

                <div class="wrapper-3">
                  <div class="custom-block2 m-b-30">
                    <div class="sec-head2">
                      <h4 class="col-white vt323"> mint & play </h4>
                    </div>
                    <div class="wrapper-2">
                      <div class="block-element m-b-30">
                        <div class="step-form ">
                          <div class="step-form-data epilogue">
                            <form>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" />
                                <b>download metamask</b> - click button to
                                download metamask, the button will turn blue
                                when extension is installed or when in the
                                metamask browser for mobile users.
                              </label>
                              <br />
                              <div class="block-element text-center m-b-10">
                                <a
                                  href="https://metamask.io/download.html"
                                  target="_blank"
                                >
                                  <button
                                    class="custom-btn2 vt323"
                                    disabled={walletFound}
                                  >
                                    <span>download wallet</span>
                                  </button>
                                </a>
                              </div>
                              <br />
                              <br />
                              <br />
                              <br />
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" />
                                <b>create a wallet</b> - create a wallet to hold
                                your fishbags.
                              </label>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" />
                                <b>deposit funds</b> - deposit funds to your
                                wallet for minting.
                              </label>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" />
                                <b>
                                  connect metamask wallet (use metamask browser
                                  on mobile)
                                </b>
                                - click button to connect wallet, the button
                                will turn blue and read "connected" when
                                successful.
                              </label>
                              <br />
                              <div class="block-element text-center m-b-10">
                                <button
                                  class="custom-btn2 vt323"
                                  onClick={connectWallet}
                                  type="button"
                                  disabled={userAddress == "connected"}
                                >
                                  <span> {userAddress} </span>
                                </button>
                              </div>
                              <br />
                              <br />
                              <br />
                              <br />
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" />
                                <b>enable network</b> - enable minting network
                                (eth, poly, arb, opt) that will be used on your
                                metamask wallet.
                              </label>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" />
                                <b>mint fishbags</b> - fishbags is an omnichain
                                NFT, your mint decision is not permanent, you
                                can traverse the chains after mint.
                              </label>
                              <label class="checkbox-label1">
                                <input type="checkbox" name="" />
                                <b>select chain</b> - click button
                                <b>eth, poly, arb,</b> or <b>opt</b> to mint.
                              </label>
                              <br />
                              <div class="block-element text-center m-b-10 buttons-holder5">
                                <button
                                  class="custom-btn2 vt323"
                                  onClick={() => mint("0x4", "Ethereum")}
                                  type="button"
                                >
                                  <span> eth </span>
                                </button>
                                <button
                                  class="custom-btn2 vt323"
                                  onClick={() => mint("0x13881", "Polygon")}
                                  type="button"
                                >
                                  <span> poly </span>
                                </button>
                                <button
                                  class="custom-btn2 vt323"
                                  onClick={() => mint("0x66eeb", "Arbitrum")}
                                  type="button"
                                >
                                  <span> arb </span>
                                </button>
                                <button
                                  class="custom-btn2 vt323"
                                  onClick={() => mint("0x45", "Optimism")}
                                  type="button"
                                >
                                  <span> opt </span>
                                </button>
                              </div>
                              <br />
                              <br />
                              <br />
                              <br />
                              <div class="block-element text-center m-b-10 label-holder4">
                                <label class="checkbox-label1">
                                  <input type="checkbox" name="" /> <b>play</b>-
                                  connect wallet w/ fishbag and compete for a
                                  spot on the top 10 leaderboard.
                                </label>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>

                      <div class="block-element text-center m-b-30">
                        <button class="vt323 custom-btn2">
                          <span>
                            <h2>play fishbags</h2>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-8 col-lg-8 col-sm-12 col-12 sec-wid-right">
                <div class="block-element">
                  <div class="custom-block2  m-b-30 d-none d-md-block d-lg-block">
                    <div class="sec-head2">
                      <h4 class="col-white vt323"> fishbags leaderboard </h4>
                    </div>
                    <div class="textual-block2 inter">
                      <h4 class="col-black"> top 10 </h4>
                      <h4 class="col-black"> </h4>
                      <h4 class="col-black"> </h4>
                    </div>
                  </div>
                  <div class="custom-block3 m-b-30">
                    <div class="sec-head2">
                      <h4 class="col-white vt323"> about </h4>
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
                              polygon, arbitrum, optimism
                            </label>
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> chain traversal
                              supported
                            </label>
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> more liquid and
                              more accessible
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
                              <input type="checkbox" name="" /> infinite runner
                            </label>
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> html5, no app,
                              play on mobile or desktop
                            </label>
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> top 10
                              leaderboard
                            </label>
                          </div>
                        </div>

                        <div class="block-element m-b-30">
                          <div class="form-head">
                            <h3 class="col-black vt323">
                              music & sfx <i class="fa fa-caret-up"> </i>
                            </h3>
                          </div>
                          <div class="form-content ">
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> built entirely
                              from algobeat #133
                            </label>
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> (chopped and
                              screwed)
                            </label>
                            <label class="checkbox-label2">
                              <input type="checkbox" name="" /> (slowed and
                              reverb)
                            </label>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="block-element">
            <div class="custom-block1">
              <div class="sec-head">
                <h3 class="col-white vt323"> fishbags specs </h3>
              </div>

              <div class="content-block1">
                <div class="textual-block1 inter">
                  <h4 class="col-black1"> fishbags lib: </h4>
                </div>

                <div class="block-element">
                  <div class="form-1 inter">
                    <form>
                      <div class="row">
                        <div class="col-md-6 col-lg-6 col-sm-6 col-12">
                          <div class="form-field1">
                            <input
                              type="text"
                              placeholder="species"
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
                              placeholder="color"
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
                              placeholder="expression"
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

                        <div class="col-md-12 col-lg-12 col-sm-12 col-12">
                          <h5 class="info-tag1 col-black">
                            <b> disclaimer: </b>
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
