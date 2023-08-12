// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

import {AiOutlinePlusCircle} from 'react-icons/ai'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinatonByGender from '../VaccinationByGender'
import VaccinatonByAge from '../VaccinationByAge'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    vaccinationCoverageList: [],
    vaccinationByGender: [],
    vaccinationByAge: [],
    apiStatues: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCoWinDetails()
  }

  getCoWinDetails = async () => {
    this.setState({apiStatues: apiStatusConstants.inProgress})

    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(apiUrl)
    const data = await response.json()
    console.log(data)

    if (response.ok === true) {
      const updatedCoverageList = data.last_7_days_vaccination.map(
        eachVaccine => ({
          dose1: eachVaccine.dose_1,
          dose2: eachVaccine.dose_2,
          vaccineDate: eachVaccine.vaccine_date,
        }),
      )

      const vaccineByAge = data.vaccination_by_age.map(eachAge => ({
        age: eachAge.age,
        count: eachAge.count,
      }))

      const vaccineByGender = data.vaccination_by_gender.map(eachGender => ({
        gender: eachGender.gender,
        count: eachGender.count,
      }))

      this.setState({
        vaccinationCoverageList: updatedCoverageList,
        vaccinationByGender: vaccineByGender,
        vaccinationByAge: vaccineByAge,
        apiStatues: apiStatusConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({
        apiStatues: apiStatusConstants.failure,
      })
    } else {
      this.setState({
        apiStatues: apiStatusConstants.inProgress,
      })
    }
  }

  loaderDisplay = () => (
    <div data-testid="loader" className="co-win-dashboard-container loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  onSuccessApi = () => {
    const {
      vaccinationCoverageList,
      vaccinationByGender,
      vaccinationByAge,
    } = this.state

    return (
      <div className="co-win-dashboard-container">
        <div className="plus-cowin-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="plus-icon"
          />
          <p className="co-win-css">Co-Win</p>
        </div>
        <h1 className="co-win-heading">CoWIN Vaccination in India</h1>
        <div className="vaccination-coverage">
          <VaccinationCoverage
            vaccinationCoverageList={vaccinationCoverageList}
          />
        </div>
        <div className="vaccination-coverage">
          <VaccinatonByGender vaccinationByGender={vaccinationByGender} />
        </div>
        <div className="vaccination-coverage">
          <VaccinatonByAge vaccinationByAge={vaccinationByAge} />
        </div>
      </div>
    )
  }

  onApiFailureCondition = () => {
    ;<div className="co-win-dashboard-container">
      <div className="plus-cowin-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          alt="website logo"
          className="plus-icon"
        />
        <p className="co-win-css">Co-Win</p>
      </div>
      <h1 className="co-win-heading">CoWIN Vaccination in India</h1>
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
          alt="failure view"
          className="failure-img"
        />
      </div>
    </div>
  }

  render() {
    const {apiStatues} = this.state

    switch (apiStatues) {
      case apiStatusConstants.success:
        return this.onSuccessApi()
      case apiStatusConstants.failure:
        return this.onApiFailureCondition()
      case apiStatusConstants.inProgress:
        return this.loaderDisplay()
      default:
        return null
    }
  }
}

export default CowinDashboard
