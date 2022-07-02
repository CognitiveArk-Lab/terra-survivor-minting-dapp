import { useState, useEffect, useMemo, useCallback } from 'react';
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { GoMute } from "@react-icons/all-files/go/GoMute";
import { GoUnmute } from "@react-icons/all-files/go/GoUnmute";
import * as anchor from "@project-serum/anchor";
// import './WalletModal';
import {
    Connection,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
    resolveToWalletAddress,
    getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import {
    findGatewayToken,
    getGatewayTokenAddressForOwnerAndGatekeeperNetwork,
    onGatewayTokenChange,
    removeAccountChangeListener,
} from '@identity.com/solana-gateway-ts';
import { CircularProgress } from '@material-ui/core';
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react';

import {
    awaitTransactionSignatureConfirmation,
    CandyMachineAccount,
    createAccountsForMint,
    getCandyMachineState,
    getCollectionPDA,
    mintOneToken,
    SetupState,
} from '../candy-machine.ts';

import { getAtaForMint, toDate } from '../utils.ts';

import Navbar from '../components/navbar/Navbar';
import RoadmapItem from '../components/roadmap/RoadmapItem';
import Nero from '../components/nero/Nero';
import Footer from '../components/footer/Footer';
import VideoModal from '../components/videoModal/VideoModal';
import SuccessModal from '../components/success/Success';
import Warn from '../components/warn/Warn';

import LoadingComponent from '../components/loading/LoadingComponent';
import { ToastContainer, toast } from 'react-toastify';
import { css } from "glamor";
import 'react-toastify/dist/ReactToastify.css';
import RoadmapCard from '../components/Card/Card';

import './main.scss'
import { useSelector } from 'react-redux';

const roadmapTexts = [
    {
        title: 'whitelist minting Public minting',
        desc: 'Releasing gen0 into the Terra-verse.'
    },
    // {
    //     title: 'Colony Investment Program',
    //     desc: 'Reinvesting the minting proceeds from DAO treasury 70% into Anchor Jocked for 2 years 30% into Ark DAO chosen projects on Terra.'
    // },
    // {
    //     title: 'Single Story mode',
    //     desc: 'A story-based game where the NFT holders put their NFT(s) into story Comic Templates.Unveil the mystery and with valuable rewards! '
    // },
    {
        title: 'Colony Leaderboard',
        desc: 'Rarity checker and leaderboard to check your scores.'
    },
    {
        title: 'Co-Op Story mode',
        desc: 'NFT Holders can put their NFT’s together with other NFT Holders and create a story from the Comic Template! '
    },
    {
        title: 'merch Store Launch',
        desc: 'A place to get a Cognitive Ark-related godies.'
    },
]

const CardColor = ['linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)',
    'linear-gradient(180deg, #7CD7D6 0%, rgba(255, 255, 255, 0) 100%)',
    'linear-gradient(180deg, rgba(168, 191, 110, 0.7) 0%, rgba(255, 255, 255, 0) 100%)',
    'linear-gradient(180deg, rgba(168, 191, 110, 0.7) 0%, rgba(255, 255, 255, 0) 100%)',
    'linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(255, 255, 255, 0) 100%)',
    'linear-gradient(180deg, rgba(124, 215, 214, 0.7) 0%, rgba(124, 215, 214, 0) 100%)'];
const Cardtext = [['THE CRYPT', 'IS OPEN!'],
['MIDNIGHT', 'GATHERING'],
['TIME TO', ' PAY TRIBUTE'],
['MONSTRUOUS', 'MERCH'],
['MOUNSTROS', 'UNIVERSE'],
['NEW', 'MONSTERS']
];
const slides = ['slide1.png', 'slide2.png']
const mintCost = "200000000"

const Main = ({ rpcHost, candyMachineId, connection, txTimeout, network }) => {
    const [modalShow, setModalShow] = useState(false)
    const [videoShow, setVideoShow] = useState(false)
    const [warnShow, setWarnShow] = useState(false)
    const [address, setAddress] = useState('WALLET CONNECT')
    const [slideNum, setSlideNum] = useState(0)
    const [connectSuccessModal, setConnectSuccessModal] = useState(false)
    const [afterSuccess, setAfterSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [balance, setBalance] = useState();
    const [itemsRemaining, setItemsRemaining] = useState(0);
    const [isWhitelistUser, setIsWhitelistUser] = useState(false);
    const [needTxnSplit, setNeedTxnSplit] = useState(true);
    const [nftCount, setNftCount] = useState(0);
    const [setupTxn, setSetupTxn] = useState();
    const [message, setMessage] = useState('')
    const [discountPrice, setDiscountPrice] = useState();
    const [isValidBalance, setIsValidBalance] = useState(false);
    const [endDate, setEndDate] = useState();
    const [isActive, setIsActive] = useState(false);
    const [isPresale, setIsPresale] = useState(false);
    const [isUserMinting, setIsUserMinting] = useState(false);


    // const [showPlaybtn, setShowbtn] = useState(true);
    // const [videoReload, setLoad] = useState(true);
    // const [smallvedio, setSmallShow] = useState(true)

    const [sound, setSound] = useState(true)
    const [volume, setVolume] = useState(18)
    const [videoClosehover, setClosehover] = useState(false);

    //videoResize
    const [Allbgshow, setAllbgshow] = useState(false);
    //CloseSign
    const [videoClose, setVideoClose] = useState(false);
    //CloseHover
    const [Closehover, setVideoclosehover] = useState(false);
    //CloseBtnshow Hidden
    const [closedark, setClockdark] = useState(false);
    //smallVideo
    const [smallVideo, setSmallvideo] = useState(false);

    //bigcontent
    const [videoStart, setvideoStart] = useState(true)
    //smallcontent
    const [videoStart2, setvideoStart2] = useState(true)

    //playbtnshow
    const [playBtn, setPlaybtn] = useState(false);

    const [mintbtnshow, setBtnShow] = useState(false);

    const [moveingblock, setshowblock] = useState(false);
    const [moveingblock2, setshowblock2] = useState(false);
    const [closehidden, setCloseHidden] = useState(true);

    const [animation2, setAniShow] = useState(false);

    let volumes = [];
    for (let i = 0; i < 18; ++i) {
        volumes.push(0)
    }

    const [alertState, setAlertState] = useState({
        open: false,
        message: "",
        severity: undefined
    });

    const wallet = useWallet();
    const curConnection = useConnection();
    const [candyMachine, setCandyMachine] = useState();
    const { requestGatewayToken, gatewayStatus } = useGateway();
    const [webSocketSubscriptionId, setWebSocketSubscriptionId] = useState(-1);
    const [verified, setVerified] = useState(false);
    const [clicked, setClicked] = useState(false);

    const anchorWallet = useMemo(() => {
        if (
            !wallet ||
            !wallet.publicKey ||
            !wallet.signAllTransactions ||
            !wallet.signTransaction
        ) {
            return;
        }

        setAddress(wallet.publicKey.toString())

        return {
            publicKey: wallet.publicKey,
            signAllTransactions: wallet.signAllTransactions,
            signTransaction: wallet.signTransaction,
        }
    }, [wallet]);

    const refreshCandyMachineState = useCallback(
        async (commitment = 'confirmed') => {
            // if (!anchorWallet) {
            //     return;
            // }

            const connection = new Connection(rpcHost, commitment);

            if (candyMachineId) {
                try {
                    const cndy = await getCandyMachineState(
                        anchorWallet,
                        candyMachineId,
                        connection,
                    );

                    let active =
                        cndy?.state.goLiveDate?.toNumber() < new Date().getTime() / 1000;
                    let presale = false;

                    // duplication of state to make sure we have the right values!
                    let isWLUser = false;
                    let userPrice = cndy.state.price;

                    if (!!anchorWallet) {
                        // whitelist mint?
                        if (cndy?.state.whitelistMintSettings) {
                            // is it a presale mint?
                            if (
                                cndy.state.whitelistMintSettings.presale &&
                                (!cndy.state.goLiveDate ||
                                    cndy.state.goLiveDate.toNumber() > new Date().getTime() / 1000)
                            ) {
                                presale = true;
                            }
                            // is there a discount?
                            if (cndy.state.whitelistMintSettings.discountPrice) {
                                setDiscountPrice(cndy.state.whitelistMintSettings.discountPrice);
                                userPrice = cndy.state.whitelistMintSettings.discountPrice;
                            } else {
                                setDiscountPrice(undefined);
                                // when presale=false and discountPrice=null, mint is restricted
                                // to whitelist users only
                                if (!cndy.state.whitelistMintSettings.presale) {
                                    cndy.state.isWhitelistOnly = true;
                                }
                            }
                            // retrieves the whitelist token
                            const mint = new anchor.web3.PublicKey(
                                cndy.state.whitelistMintSettings.mint,
                            );
                            const token = (
                                await getAtaForMint(mint, anchorWallet.publicKey)
                            )[0];

                            try {
                                const balance = await connection.getTokenAccountBalance(token);
                                isWLUser = parseInt(balance.value.amount) > 0;
                                // only whitelist the user if the balance > 0
                                setIsWhitelistUser(isWLUser);

                                if (cndy.state.isWhitelistOnly) {
                                    active = isWLUser && (presale || active);
                                }
                            } catch (e) {
                                setIsWhitelistUser(false);
                                // no whitelist user, no mint
                                if (cndy.state.isWhitelistOnly) {
                                    active = false;
                                }
                                console.log(e);
                            }
                        }

                        userPrice = isWLUser ? userPrice : cndy.state.price;

                        if (cndy?.state.tokenMint) {
                            // retrieves the SPL token
                            const mint = new anchor.web3.PublicKey(cndy.state.tokenMint);
                            console.log('toknemint:', mint)
                            const token = (
                                await getAtaForMint(mint, anchorWallet.publicKey)
                            )[0];
                            try {
                                const balance = await connection.getTokenAccountBalance(token);

                                const valid = new anchor.BN(balance.value.amount).gte(userPrice);

                                // only allow user to mint if token balance >  the user if the balance > 0
                                setIsValidBalance(valid);
                                console.log("tokne balance:", balance.toString(), valid)
                                active = active && valid;
                                console.log('token mint active:', active)
                            } catch (e) {
                                console.log('token mint not active')
                                setIsValidBalance(false);
                                active = false;
                                // no whitelist user, no mint
                                console.log('There was a problem fetching SPL token balance');
                                console.log(e);
                            }
                        } else {
                            const balance = new anchor.BN(
                                await connection.getBalance(anchorWallet.publicKey),
                            );
                            const valid = balance.gte(userPrice);
                            setIsValidBalance(valid);
                            console.log('not token mint')
                            active = active && valid;
                            console.log('Setting is valid balance:', active)
                        }

                        // datetime to stop the mint?
                        if (cndy?.state.endSettings?.endSettingType.date) {
                            setEndDate(toDate(cndy.state.endSettings.number));
                            if (
                                cndy.state.endSettings.number.toNumber() <
                                new Date().getTime() / 1000
                            ) {
                                active = false;
                            }
                        }
                        // amount to stop the mint?
                        if (cndy?.state.endSettings?.endSettingType.amount) {
                            let limit = Math.min(
                                cndy.state.endSettings.number.toNumber(),
                                cndy.state.itemsAvailable,
                            );
                            if (cndy.state.itemsRedeemed < limit) {
                                setItemsRemaining(limit - cndy.state.itemsRedeemed);
                            } else {
                                setItemsRemaining(0);
                                cndy.state.isSoldOut = true;
                            }
                        } else {
                            setItemsRemaining(cndy.state.itemsRemaining);
                        }
                    }

                    if (cndy.state.isSoldOut) {
                        console.log('Candy machien Sold out')
                        active = false;
                    }

                    const [collectionPDA] = await getCollectionPDA(candyMachineId);
                    const collectionPDAAccount = await connection.getAccountInfo(
                        collectionPDA,
                    );

                    setIsActive((cndy.state.isActive = active));
                    setIsPresale((cndy.state.isPresale = presale));
                    setCandyMachine(cndy);

                    const txnEstimate =
                        892 +
                        (!!collectionPDAAccount && cndy.state.retainAuthority ? 182 : 0) +
                        (cndy.state.tokenMint ? 66 : 0) +
                        (cndy.state.whitelistMintSettings ? 34 : 0) +
                        (cndy.state.whitelistMintSettings?.mode?.burnEveryTime ? 34 : 0) +
                        (cndy.state.gatekeeper ? 33 : 0) +
                        (cndy.state.gatekeeper?.expireOnUse ? 66 : 0);


                    setNeedTxnSplit(txnEstimate > 1230);
                } catch (e) {
                    if (e instanceof Error) {
                        if (
                            e.message === `Account does not exist ${candyMachineId}`
                        ) {
                            setMessage(`Couldn't fetch candy machine state from candy machine with address: ${candyMachineId}, using rpc: ${rpcHost}! You probably typed the REACT_APP_CANDY_MACHINE_ID value in wrong in your .env file, or you are using the wrong RPC!`)
                            setshowblock(true)
                            setTimeout(() => {
                                setshowblock(false)
                            }, 5000)
                            // setAlertState({
                            //     open: true,
                            //     message: `Couldn't fetch candy machine state from candy machine with address: ${candyMachineId}, using rpc: ${rpcHost}! You probably typed the REACT_APP_CANDY_MACHINE_ID value in wrong in your .env file, or you are using the wrong RPC!`,
                            //     severity: 'error',
                            //     hideDuration: null,
                            // });
                        } else if (
                            e.message.startsWith('failed to get info about account')
                        ) {
                            setMessage(`Couldn't fetch candy machine state with rpc: ${rpcHost}! This probably means you have an issue with the REACT_APP_SOLANA_RPC_HOST value in your .env file, or you are not using a custom RPC!`)
                            setshowblock(true)
                            setTimeout(() => {
                                setshowblock(false)
                            }, 5000)
                            // setAlertState({
                            //     open: true,
                            //     message: `Couldn't fetch candy machine state with rpc: ${rpcHost}! This probably means you have an issue with the REACT_APP_SOLANA_RPC_HOST value in your .env file, or you are not using a custom RPC!`,
                            //     severity: 'error',
                            //     hideDuration: null,
                            // });
                        }
                    } else {
                        setMessage(`${e}`)
                        setshowblock(true)
                        setTimeout(() => {
                            setshowblock(false)
                        }, 5000)
                        // setAlertState({
                        //     open: true,
                        //     message: `${e}`,
                        //     severity: 'error',
                        //     hideDuration: null,
                        // });
                    }
                    console.log(e);
                }
            } else {
                setMessage(`Your REACT_APP_CANDY_MACHINE_ID value in the .env file doesn't look right! Make sure you enter it in as plain base-58 address!`)
                setshowblock(true)
                setTimeout(() => {
                    setshowblock(false)
                }, 5000)
                // setAlertState({
                //     open: true,
                //     message: `Your REACT_APP_CANDY_MACHINE_ID value in the .env file doesn't look right! Make sure you enter it in as plain base-58 address!`,
                //     severity: 'error',
                //     hideDuration: null,
                // });
            }
        },
        [anchorWallet, candyMachineId, rpcHost],
    );

    useEffect(() => {
        (async () => {
            if (wallet && !!wallet.publicKey) {
                const balance = await connection.getBalance(wallet.publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
                try {
                    const publicAddress = await resolveToWalletAddress({
                        text: wallet?.publicKey?.toString() || ''
                    });

                    const nftArray = await getParsedNftAccountsByOwner({
                        publicAddress,
                        connection
                    });
                    console.log('nftarray:', nftArray)
                    setNftCount(nftArray.filter(nft => nft.data.name.includes('Mfer Graduates')).length)
                } catch (error) {
                    console.log("Error thrown, while fetching NFTs");
                }
            }

        })();
    }, [wallet, connection]);

    const onConnectClick = () => {
        setAfterSuccess(true)
        setModalShow(true)
    }
    const onCloseModal = () => {
        setModalShow(false)
    }
    const onPlayClick = () => {
        setVideoShow(true)
    }
    const onCloseVideo = () => {
        setVideoShow(false)
    }

    const mintToastId = "custom-id-yes";
    const warnId = 'warnToastId'

    const onMint = async (
        beforeTransactions,
        afterTransactions,
    ) => {
        const connection = new Connection(rpcHost, 'confirmed');
        if (!anchorWallet || !connection) {
            setMessage("Connect your wallet")
            setshowblock(true)
            setTimeout(() => {
                setshowblock(false)
            }, 5000)
            return
        }
        if (!isValidBalance) {
            setMessage("You don't have TLS Token in your wallet")
            setshowblock(true)
            setTimeout(() => {
                setshowblock(false)
            }, 5000)
            return
        }
        if (nftCount > 0) {
            setMessage('You have already minted the NFT')
            setshowblock(true)
            setTimeout(() => {
                setshowblock(false)
            }, 5000)
            return
        }
        try {
            setIsUserMinting(true);
            document.getElementById('#identity')?.click();
            if (wallet.connected && candyMachine?.program && wallet.publicKey) {
                let setupMint;
                if (needTxnSplit && setupTxn === undefined) {
                    setupMint = await createAccountsForMint(
                        candyMachine,
                        wallet.publicKey,
                    );
                    let status = { err: true };
                    if (setupMint.transaction) {
                        status = await awaitTransactionSignatureConfirmation(
                            setupMint.transaction,
                            txTimeout,
                            connection,
                            true,
                        );
                    }
                    if (status && !status.err) {
                        setSetupTxn(setupMint);
                        // setMessage('Setup transaction succeeded! Please sign minting transaction')
                        // setshowblock2(true)
                        // setTimeout(() => {
                        //     setshowblock2(false)
                        // }, 5000)
                        // setAlertState({
                        //     open: true,
                        //     message:
                        //         'Setup transaction succeeded! Please sign minting transaction',
                        //     severity: 'info',
                        // });

                    } else {
                        setMessage('Mint failed! Please try again!')
                        setshowblock(true)
                        setTimeout(() => {
                            setshowblock(false)
                        }, 5000)
                        // setAlertState({
                        //     open: true,
                        //     message: 'Mint failed! Please try again!',
                        //     severity: 'error',
                        // });
                        return;
                    }
                } else {
                    setMessage('Please sign minting transaction')
                    setshowblock2(true)
                    setTimeout(() => {
                        setshowblock2(false)
                    }, 5000)
                    // setAlertState({
                    //     open: true,
                    //     message: 'Please sign minting transaction',
                    //     severity: 'info',
                    // });
                }

                let mintResult = await mintOneToken(
                    candyMachine,
                    wallet.publicKey,
                    beforeTransactions,
                    afterTransactions,
                    setupMint ?? setupTxn,
                );

                let status = { err: true };
                let metadataStatus = null;
                if (mintResult) {
                    status = await awaitTransactionSignatureConfirmation(
                        mintResult.mintTxId,
                        txTimeout,
                        connection,
                        true,
                    );

                    metadataStatus =
                        await candyMachine.program.provider.connection.getAccountInfo(
                            mintResult.metadataKey,
                            'processed',
                        );
                }

                if (status && !status.err && metadataStatus) {
                    // manual update since the refresh might not detect
                    // the change immediately
                    let remaining = itemsRemaining - 1;
                    setItemsRemaining(remaining);
                    setIsActive((candyMachine.state.isActive = remaining > 0));
                    candyMachine.state.isSoldOut = remaining === 0;
                    setSetupTxn(undefined);
                    setMessage('THE TRANSACTION IS SUCCESSFUL!')
                    setshowblock2(true)
                    setTimeout(() => {
                        setshowblock2(false)
                    }, 5000)
                    // setAlertState({
                    //     open: true,
                    //     message: 'Congratulations! Mint succeeded!',
                    //     severity: 'success',
                    //     hideDuration: 7000,
                    // });
                    const balance = await connection.getBalance(wallet.publicKey);
                    setBalance(balance / LAMPORTS_PER_SOL);
                    refreshCandyMachineState('processed');
                } else if (status && !status.err) {
                    setMessage('Mint likely failed! Anti-bot SOL 0.01 fee potentially charged! Check the explorer to confirm the mint failed and if so, make sure you are eligible to mint before trying again.')
                    setshowblock(true)
                    setTimeout(() => {
                        setshowblock(false)
                    }, 5000)
                    // setAlertState({
                    //     open: true,
                    //     message:
                    //         'Mint likely failed! Anti-bot SOL 0.01 fee potentially charged! Check the explorer to confirm the mint failed and if so, make sure you are eligible to mint before trying again.',
                    //     severity: 'error',
                    //     hideDuration: 8000,
                    // });
                    refreshCandyMachineState();
                } else {
                    setMessage('Mint failed! Please try again!')
                    setshowblock(true)
                    setTimeout(() => {
                        setshowblock(false)
                    }, 5000)
                    // setAlertState({
                    //     open: true,
                    //     message: 'Mint failed! Please try again!',
                    //     severity: 'error',
                    // });
                    refreshCandyMachineState();
                }
            }
        } catch (error) {
            let msg = error.msg || 'Minting failed! Please try again!';
            if (!error.msg) {
                if (!error.message) {
                    msg = 'Transaction timeout! Please try again.';
                } else if (error.message.indexOf('0x137')) {
                    console.log(error);
                    msg = `SOLD OUT!`;
                } else if (error.message.indexOf('0x135')) {
                    msg = `Insufficient funds to mint. Please fund your wallet.`;
                }
            } else {
                if (error.code === 311) {
                    console.log(error);
                    msg = `SOLD OUT!`;
                    window.location.reload();
                } else if (error.code === 312) {
                    msg = `Minting period hasn't started yet.`;
                }
            }
            setMessage(msg)
            setshowblock(true)
            setTimeout(() => {
                setshowblock(false)
            }, 5000)
            // setAlertState({
            //     open: true,
            //     message,
            //     severity: 'error',
            // });
            // updates the candy machine state to reflect the latest
            // information on chain
            refreshCandyMachineState();
        } finally {
        }
    };

    const mint = async () => {
        if (candyMachine?.state.isActive && candyMachine?.state.gatekeeper) {
            const network =
                candyMachine.state.gatekeeper.gatekeeperNetwork.toBase58();
            if (network === 'ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6') {
                if (gatewayStatus === GatewayStatus.ACTIVE) {
                    await onMint();
                } else {
                    // setIsMinting(true);
                    await requestGatewayToken();
                    console.log('after: ', gatewayStatus);
                }
            } else if (
                network === 'ttib7tuX8PTWPqFsmUFQTj78MbRhUmqxidJRDv4hRRE' ||
                network === 'tibePmPaoTgrs929rWpu755EXaxC7M3SthVCf6GzjZt'
            ) {
                setClicked(true);
                const gatewayToken = await findGatewayToken(
                    curConnection.connection,
                    wallet.publicKey,
                    candyMachine.state.gatekeeper.gatekeeperNetwork,
                );

                if (gatewayToken?.isValid()) {
                    await onMint();
                } else {
                    window.open(
                        `https://verify.encore.fans/?gkNetwork=${network}`,
                        '_blank',
                    );

                    const gatewayTokenAddress =
                        await getGatewayTokenAddressForOwnerAndGatekeeperNetwork(
                            wallet.publicKey,
                            candyMachine.state.gatekeeper.gatekeeperNetwork,
                        );

                    setWebSocketSubscriptionId(
                        onGatewayTokenChange(
                            curConnection.connection,
                            gatewayTokenAddress,
                            () => setVerified(true),
                            'confirmed',
                        ),
                    );
                }
            } else {
                setClicked(false);
                throw new Error(`Unknown Gatekeeper Network: ${network}`);
            }
        } else {
            await onMint();
            setClicked(false);
        }
    }

    const roadmaps = roadmapTexts.map((item, index) => {
        return <RoadmapItem title={item.title} desc={item.desc} key={index} order={index} />
    })

    useEffect(() => {
        setTimeout(() => {
            setSlideNum(1 - slideNum)
        }, 5000)
    }, [slideNum])

    useEffect(() => {
        refreshCandyMachineState();
    }, [
        anchorWallet,
        candyMachineId,
        connection,
        refreshCandyMachineState,
    ]);

    useEffect(() => {
        (function loop() {
            setTimeout(() => {
                refreshCandyMachineState();
                loop();
            }, 20000);
        })();
    }, [refreshCandyMachineState]);

    return (
        <div className='body'>
            <Navbar closehidden={closehidden} setCloseHidden={setCloseHidden} moveingblock={moveingblock} setshowblock={setshowblock} mintbtnshow={mintbtnshow} setBtnShow={setBtnShow} playBtn={playBtn} setPlaybtn={setPlaybtn} videoStart={videoStart} setvideoStart={setvideoStart} Allbgshow={Allbgshow} setAllbgshow={setAllbgshow} videoStart2={videoStart2} setvideoStart2={setvideoStart2} onConnectClick={onConnectClick} address={address} walletColor={afterSuccess} balance={balance} wallet={wallet} setAfterSuccess={setAfterSuccess} />

            <div className='max-main-container container'>
                <div className={!Allbgshow ? 'video-modal-body' : 'video-bgshow-body'}>

                    <div className="video-modal-bloc">
                        <VideoModal closehidden={closehidden} setCloseHidden={setCloseHidden} moveingblock={moveingblock} setshowblock={setshowblock} playBtn={playBtn} setPlaybtn={setPlaybtn} videoStart={videoStart} setStart={setvideoStart} videoStart2={videoStart2} setvideoStart2={setvideoStart2} closedark={closedark} setSmallvideo={setSmallvideo} Closehover={Closehover} setVideoclosehover={setVideoclosehover} Allbgshow={Allbgshow} setAllbgshow={setAllbgshow} setVolume={setVolume} volume={volume} setSound={setSound} sound={sound} show={videoShow} onClose={onCloseVideo} />

                    </div>
                </div>
                <div className='mainBody container'>
                    <div id='animation' className='animation'>
                        <div className={moveingblock ? 'child-animation background' : 'btn-click background'}>{message}</div>
                        <div className={moveingblock2 ? 'child-animation background2' : 'btn-click background2'}>{message}</div>
                    </div>
                    <div className='main-left'>
                        <div className='slide'>
                            <img src='/assets/TERRAPOCALYPSESURVIVOR.jpg' />
                        </div>

                    </div>
                    <div className='main-right'>
                        <Nero moveingblock={moveingblock} setshowblock={setshowblock} moveingblock2={moveingblock2} animation2={animation2} setAniShow={setAniShow} setshowblock2={setshowblock2} mintbtnshow={mintbtnshow} setBtnShow={setBtnShow} onPlayClick={onPlayClick} onClickMint={() => mint()} itemsRedeemed={candyMachine?.state.itemsRedeemed} itemsAvailable={candyMachine?.state.itemsAvailable} isActive={isValidBalance} wallet={wallet} />
                    </div>
                </div>
            </div>
            <Footer />
            {/* <SuccessModal show={connectSuccessModal} onClose={() => setConnectSuccessModal(false)} /> */}
            <Warn show={warnShow} closeSuccessModal={() => setWarnShow(false)} />
            <ToastContainer
                hideProgressBar={true}
                pauseOnFocusLoss={false}
                autoClose={5000}
                closeButton={false}
                onClick={() => setAfterSuccess(false)}
            />
            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={() => setAlertState({ ...alertState, open: false })}
            >
                <Alert
                    onClose={() => setAlertState({ ...alertState, open: false })}
                    severity={alertState.severity}
                >
                    {alertState.message}
                </Alert>
            </Snackbar>
        </div>

    )
}

export default Main