import React, { useState, useEffect } from 'react'
import Web3 from "web3"
import Origin from "../../abis/Origin.json"
import AddProduct from '../AddProduct'
import Sidebar from '../Sidebar'
import Product from '../Product'
import "../App.css"
import Button from "../FormButton"

const Products = () => {

    useEffect(() => { 
        const loadWeb3 = async () => {
            if(window.ethereum) {
              window.web3 = new Web3(window.ethereum)
              await window.ethereum.enable()
            } if (window.web3) {
              window.web3 = new Web3(window.web3.currentProvider)
            } else {
              window.alert("Please use Metamask!")
            }
        }
        loadWeb3()}, [])

    useEffect(() => { 
            const loadBlockchainData = async () => {
                const web3 = window.web3
                //Load account
                const accounts = await web3.eth.getAccounts()
                setAccount(accounts[0])
                console.log(Origin.abi)
                const networkId = await web3.eth.net.getId()
                console.log(networkId)
                const networkData = Origin.networks[networkId]
                console.log(networkData)
                if (networkData) {
                    //Fetch contract
                    const contract = new web3.eth.Contract(Origin.abi, networkData.address)
                    setContract(contract)
                    console.log(contract)
                    const productCount = await contract.methods.productCount().call()
                    //Load products
                    for (var i = 1; i <= productCount; i++) {
                        const newProduct = await contract.methods.products(i).call()
                        setProducts(products =>([...products, newProduct]))
                    }
                    }
                else { 
                    window.alert("Origin contract is not deployed to the detected network")
                }
            }
            loadBlockchainData()}, [])
    
    const [products, setProducts] = useState([])
    const [contract, setContract] = useState([])
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [account, setAccount] = useState([])        

    //Add Product
    const addProduct = ({name, image, process, date}) => {
        contract.methods.addProduct(name, image, process, date).send( {from: account} )
        .once('receipt', (receipt) => {
            window.location.reload()
          })
    }

    const onView = (hash) => {
        const url = `https://ipfs.infura.io/ipfs/${hash}`
        window.open(url)
    } 

    return (
        <>
        <div>
            <Sidebar />
            <div className="main-container">
            <header className="product-header"> 
                <h2>Products</h2> 
                <Button className="btn" 
                onClick={() => setShowAddProduct(!showAddProduct)}
                color={showAddProduct ? "#f2f2f2": "#3eb049"}
                text={showAddProduct ? "X": <>{"Add Product"}</>}
                />
            </header>
            {showAddProduct && <AddProduct onAdd={() => setShowAddProduct(!showAddProduct)} 
            addProduct={addProduct}/>}
            <Product onView={onView} products={products} /> 
            </div>
        </div>
        </>
    )
}

export default Products
