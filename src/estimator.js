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
    unTruncatedFactor = (data.timeToElapse * 7) / 3;
    truncatedFactor = Math.trunc(unTruncatedFactor);
    periodInDays = data.timeToElapse * 7;
  } else if (data.periodType === 'months') {
    unTruncatedFactor = (data.timeToElapse * 30) / 3;
    truncatedFactor = Math.trunc(unTruncatedFactor);
    periodInDays = data.timeToElapse * 30;
  }
  outputData.impact.currentlyInfected = data.reportedCases * 10;
  outputData.severeImpact.currentlyInfected = data.reportedCases * 50;
  outputData.impact.infectionsByRequestedTime = outputData.impact.currentlyInfected
      * ((2 ** truncatedFactor));
  outputData.severeImpact.infectionsByRequestedTime = outputData.severeImpact.currentlyInfected
      * ((2 ** truncatedFactor));
  const t = outputData.impact.infectionsByRequestedTime * 0.15;
  outputData.impact.severeCasesByRequestedTime = Math.round(t * (10 ** 0)) / (10 ** 0);
  const v = outputData.severeImpact.infectionsByRequestedTime * 0.15;
  outputData.severeImpact.severeCasesByRequestedTime = Math.round(v * (10 ** 0)) / (10 ** 0);
  const b = 0.35 * data.totalHospitalBeds;
  const bb = Math.round(b * (10 ** 0)) / (10 ** 0);
  outputData.impact.hospitalBedsByRequestedTime = bb - outputData.impact.severeCasesByRequestedTime;
  const p = (0.35 * data.totalHospitalBeds);
  const pp = Math.round(p * (10 ** 0)) / (10 ** 0);
  outputData.severeImpact
    .hospitalBedsByRequestedTime = pp - outputData
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
