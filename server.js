const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const ASAAS_API_KEY = "$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjIyMTZjYWMxLTlkZmMtNDgwNy05MzZkLTE0NDYzMTk0MDhkZTo6JGFhY2hfM2VhMzUxY2EtZTNiZS00MWVlLWIzMjYtMmZiM2NlM2U1MTI5";
const ASAAS_URL = "https://sandbox.asaas.com/api/v3";

app.post("/criar-pagamento", async (req, res) => {
  const { nome, email, cpf } = req.body;

  try {
    // 1. Criar cliente
    const cliente = await axios.post(
      `${ASAAS_URL}/customers`,
      {
        name: nome,
        email: email,
        cpfCnpj: cpf
      },
      {
        headers: {
          access_token: ASAAS_API_KEY
        }
      }
    );

    // 2. Criar cobrança
    const pagamento = await axios.post(
      `${ASAAS_URL}/payments`,
      {
        customer: cliente.data.id,
        billingType: "PIX",
        value: 19.99,
        dueDate: new Date().toISOString().split("T")[0]
      },
      {
        headers: {
          access_token: ASAAS_API_KEY
        }
      }
    );

    res.json({
      invoiceUrl: pagamento.data.invoiceUrl
    });

  } catch (err) {
    res.status(500).json(err.response?.data || err);
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
