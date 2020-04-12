function processForm(e) {
  if (e.preventDefault) e.preventDefault();

  return false;
}

const form = document.getElementById('covid-19-estimator-form');
if (form.attachEvent) {
  form.attachEvent('submit', processForm);
} else {
  form.addEventListener('submit', processForm);
}
