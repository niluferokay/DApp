import React, { useState, useEffect } from 'react'
import Web3 from "web3"
import Assessment from "../../abis/Assessments.json"
import {Bar} from "react-chartjs-2"
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
} from 'chart.js';
import Sidebar from '../Sidebar';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
)

const LCAReport = () => {

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
          const accounts = await web3.eth.getAccounts()
          setAccount(accounts[0])
          const networkId = await web3.eth.net.getId()
          const networkData = Assessment.networks[networkId]
          if (networkData) {
              //Fetch contract
              const contract = new web3.eth.Contract(Assessment.abi, networkData.address)
              setContract(contract)
              const LCACount = await contract.methods.LCACount().call()
              setLCACount(LCACount)
              //Load LCAs
              for (var i = 1; i <= LCACount; i++) {
                  const newLCA = await contract.methods.LCAs(i).call()
                  setLCAs(LCAs =>([...LCAs, newLCA]))
              }
              for (var i = 1; i <= LCACount; i++) {
                  const newLCA = await contract.methods.LCAs(i).call()
                  setForm(LCAs =>([...LCAs, JSON.parse(newLCA.document)]))
              }
              }
          else { 
              window.alert("Assessment contract is not deployed to the detected network")
          }
      }
      loadBlockchainData()}, [])
  
    const [contract, setContract] = useState([])
    const [account, setAccount] = useState([])        
    const [LCACount, setLCACount] = useState()
    const [LCAs, setLCAs] = useState([])        
    const [date, setDate] = useState("")
    const [document, setDocument] = useState([])
    const [form, setForm] = useState([])
  
    const data = (LCAs.map(t1 => ({...t1, ...form.find(t2 => t2.id === t1.id)})))

    const [energyChartData, setEnergyChartData] = useState({
        datasets: [],
    });

    const [waterChartData, setWaterChartData] = useState({
        datasets: [],
    });

    const [materialChartData, setMaterialChartData] = useState({
        datasets: [],
    });

    const [ghgChartData, setGhgChartData] = useState({
        datasets: [],
    });

    const [pollutionChartData, setPollutionChartData] = useState({
        datasets: [],
    });
    
    const [wasteChartData, setWasteChartData] = useState({
        datasets: [],
    });

    const [energy, setEnergy] = useState([])
    const [renewenergy, setRenewenergy] = useState([])
    const [water, setWater] = useState([])
    const [waterrec, setWaterrec] = useState([])
    const [material, setMaterial] = useState([])
    const [materialrec, setMaterialrec] = useState([])
    const [ghg, setGhg] = useState([])
    const [waterpol, setWaterpol] = useState([])
    const [soilpol, setSoilpol] = useState([])
    const [air, setAir] = useState([])
    const [hazmat, setHazmat] = useState([])
    const [solidwaste, setSolidwaste] = useState([])
    const [waterwaste, setWaterwaste] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [id, setId] = useState([])

    const [optionsE, setOptionsE] = useState({})
    const [optionsW, setOptionsW] = useState({})
    const [optionsG, setOptionsG] = useState({})
    const [optionsM, setOptionsM] = useState({})
    const [optionsP, setOptionsP] = useState({})

  const charts = async () => {
    setEnergy(data.map(a => parseInt(a.energy)))
    setId(data.map(a => (a.process)))
    setWater(data.map(a => parseInt(a.water)))
    setWaterrec(data.map(a => parseInt(a.waterrec)))
    setMaterial(data.map(a => parseInt(a.material)))
    setMaterialrec(data.map(a => parseInt(a.materialrec)))
    setGhg(data.map(a => parseInt(a.ghg)))
    setWaterpol(data.map(a => parseInt(a.waterpol)))
    setSoilpol(data.map(a => parseInt(a.soilpol)))
    setAir(data.map(a => parseInt(a.air)))
    setHazmat(data.map(a => parseInt(a.hazmat)))
    setSolidwaste(data.map(a => parseInt(a.solidwaste)))
    setWaterwaste(data.map(a => parseInt(a.waterwaste)))

    setEnergyChartData({
      labels: id,
      datasets: [
        {
          label: "Energy Consumption",
          data: energy,
          borderColor: "rgb(253,224,138)",
          backgroundColor: "rgba(253,224,138, 0.4)",
        },
        {
          label: "Renewable energy Consumption",
          data: renewenergy,
          borderColor: "rgb(184,225,133)",
          backgroundColor: "rgba(184,225,133, 0.4)",
        },
      ]
    },
    setOptionsE({
      responsive: true,
      scales: {
        y: {
        title: {
            display: true,
            text: 'Energy (kWh)',
            }
        }
    },
    })
    );

    setWaterChartData({
      labels: id,
      datasets: [
        {
          label: "Water Consumption",
          data: water,
          borderColor: "rgb(171,217,233)",
          backgroundColor: "rgba(171,217,233, 0.4)",
        },
        {
          label: "Recycled or Reused Water Consumption",
          data: waterrec,
          borderColor: "rgb(98,195,165)",
          backgroundColor: "rgba(98,195,165, 0.4)",
        },
      ],
    },
    setOptionsW({
      responsive: true,
      scales: {
        y: {
        title: {
            display: true,
            text: 'Water (m3)',
            }
        }
    },
    }));

    setMaterialChartData({
      labels: id,
      datasets: [
        {
          label: "Material Consumption",
          data: material,
          borderColor: "rgb(253,174,97)",
          backgroundColor: "rgba(253,174,97, 0.4)",
        },
        {
          label: "Recycled or Reused Material Consumption",
          data: materialrec,
          borderColor: "rgb(226,117,174)",
          backgroundColor: "rgba(226,117,174, 0.4)",
        },
        {
          label: "Hazardous Material Consumption",
          data: hazmat,
          borderColor: "rgb(118,111,178)",
          backgroundColor: "rgba(118,111,178, 0.4)",
        },
      ],
    },
    setOptionsM({
      responsive: true,
      scales: {
        y: {
        title: {
            display: true,
            text: 'Material (kg)',
            }
        }
    },
    }));

    setGhgChartData({
      labels: id,
      datasets: [
        {
          label: "Greenhouse Gas Emission",
          data: ghg,
          borderColor: "rgb(213,49,36)",
          backgroundColor: "rgba(213,49,36, 0.4)",
        },
        {
          label: "Air Pollution",
          data: air,
          borderColor: "rgb(204,204,204)",
          backgroundColor: "rgba(204,204,204, 0.4)",
        },
      ],
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    },
    setOptionsG({
      responsive: true,
      scales: {
        y: {
        title: {
            display: true,
            text: 'Water (m3)',
            }
        }
    },
    }));

    setPollutionChartData({
      labels: id,
      datasets: [
        {
          label: "Soil Pollution",
          data: soilpol,
          borderColor: "rgb(236,113,20)",
          backgroundColor: "rgba(236,113,20, 0.4)",
        },
        {
          label: "Solid Waste",
          data: solidwaste,
          borderColor: "rgb(167,86,40)",
          backgroundColor: "rgba(167,86,40, 0.4)",
        },
      ],
    },
    setOptionsP({
      responsive: true,
      scales: {
        y: {
        title: {
            display: true,
            text: 'Water (m3)',
            }
        }
    },
    }));

    setWasteChartData({
      labels: id,
      datasets: [
        {
          label: "Water Pollution",
          data: waterpol,
          borderColor: "rgb(98,190,145)",
          backgroundColor: "rgba(98,190,145, 0.4)",
        },
        {
          label: "Water Waste",
          data: waterwaste,
          borderColor: "rgb(49,135,189)",
          backgroundColor: "rgba(49,135,189, 0.4)",
        },
      ],
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  useEffect(() => { 
  charts()
  }, [data]);
  
  return (
    <>
      <Sidebar/>
      <div className='charts-header'>
        <h2>Life Cycle Assessment Report</h2>
      </div>
      <div className='charts'>
        <div>
        <Bar className='line' data={energyChartData} options={optionsE}/>
        </div>
        <div>
        <Bar className='line' data={waterChartData} options={optionsW}/>
        </div>
        <div>
        <Bar className='line' data={materialChartData} options={optionsM}/>
        </div>
        <div>
        <Bar className='line' data={ghgChartData} options={optionsG}/>
        </div>
        <div>
        <Bar className='line' data={pollutionChartData} options={optionsP}/>
        </div>
        <div>
        <Bar className='line' data={wasteChartData} options={optionsW}/>
        </div>
      </div>
    </>
  )

}

export default LCAReport
