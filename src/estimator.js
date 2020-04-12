const covid19ImpactEstimator = (data) => {
  const outputData = {
    data,
    impact: {
      currentlyInfected: null,
      infectionsByRequestedTime: null,
      severeCasesByRequestedTime: null,
      hospitalBedsByRequestedTime: null,
      casesForICUByRequestedTime: null,
      casesForVentilatorsByRequestedTime: null,
      dollarsInFlight: null
    },
    severeImpact: {
      currentlyInfected: null,
      infectionsByRequestedTime: null,
      severeCasesByRequestedTime: null,
      hospitalBedsByRequestedTime: null,
      casesForICUByRequestedTime: null,
      casesForVentilatorsByRequestedTime: null,
      dollarsInFlight: null
    }
  };
  let truncatedFactor;
  let unTruncatedFactor;
  let periodInDays;
  if (data.periodType === 'days') {
    unTruncatedFactor = data.timeToElapse / 3;
    truncatedFactor = Math.trunc(unTruncatedFactor);
    periodInDays = data.timeToElapse;
  } else if (data.periodType === 'weeks') {
    truncatedFactor = (data.timeToElapse * 7) / 3;
    periodInDays = data.timeToElapse * 7;
  } else if (data.periodType === 'months') {
    truncatedFactor = (data.timeToElapse * 30) / 3;
    periodInDays = data.timeToElapse * 30;
  }
  outputData.impact.currentlyInfected = data.reportedCases * 10;
  outputData.severeImpact.currentlyInfected = data.reportedCases * 50;
  outputData.impact.infectionsByRequestedTime = Math.trunc(outputData.impact.currentlyInfected
      * ((2 ** truncatedFactor)));
  outputData.severeImpact.infectionsByRequestedTime = Math.trunc(
    outputData.severeImpact.currentlyInfected
      * ((2 ** truncatedFactor))
  );
  outputData.impact.severeCasesByRequestedTime = Math.trunc(
    outputData.impact.infectionsByRequestedTime * 0.15
  );
  outputData.severeImpact.severeCasesByRequestedTime = Math.trunc(
    outputData.severeImpact.infectionsByRequestedTime * 0.15
  );
  outputData.impact.hospitalBedsByRequestedTime = (
    Math.trunc(0.35 * data.totalHospitalBeds)) - outputData.impact.severeCasesByRequestedTime;
  outputData.severeImpact
    .hospitalBedsByRequestedTime = (
      Math.trunc(0.35 * data.totalHospitalBeds)) - outputData
      .severeImpact.severeCasesByRequestedTime;
  outputData.impact
    .casesForICUByRequestedTime = outputData.impact.infectionsByRequestedTime * 0.05;
  outputData.severeImpact
    .casesForICUByRequestedTime = outputData.severeImpact.infectionsByRequestedTime * 0.05;
  outputData.impact
    .casesForVentilatorsByRequestedTime = Math.trunc(
      outputData.impact.infectionsByRequestedTime * 0.02
    );
  outputData.severeImpact
    .casesForVentilatorsByRequestedTime = Math.trunc(
      outputData.severeImpact.infectionsByRequestedTime * 0.02
    );
  outputData.impact.dollarsInFlight = Math.trunc(
    (outputData.impact.infectionsByRequestedTime
            * data.region.avgDailyIncomeInUSD
            * data.region.avgDailyIncomePopulation) / periodInDays
  );
  outputData.severeImpact.dollarsInFlight = Math.trunc(
    (outputData.severeImpact.infectionsByRequestedTime
            * data.region.avgDailyIncomeInUSD
            * data.region.avgDailyIncomePopulation) / periodInDays
  );
  return outputData;
};

export default covid19ImpactEstimator;
