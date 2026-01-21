async function pagar() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const cpf = document.getElementById("cpf").value;

  const res = await fetch("http://localhost:3000/criar-pagamento", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome, email, cpf })
  });

  const data = await res.json();

  if (data.invoiceUrl) {
    window.location.href = data.invoiceUrl;
  } else {
    document.getElementById("resultado").innerText =
      "Erro ao gerar pagamento";
  }
}
