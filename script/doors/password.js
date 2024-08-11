function validateForm() {
    let x = document.forms["password"]["pwd"].value;
    if (x != "78star15star78") {
      alert("Not correct...")
      return false;
    }
  }
