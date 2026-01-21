const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_URL = "https://sandbox.asaas.com/api/v3";

app.post("/criar-pagamento", async (req, res) => {
  const { nome, email, cpf, metodo } = req.body;

  const metodosPermitidos = ["PIX", "CREDIT_CARD", "BOLETO"];
  if (!metodosPermitidos.includes(metodo)) {
    return res.status(400).json({ message: "Método inválido" });
  }

  try {
    // Criar cliente
    const cliente = await axios.post(
      `${ASAAS_URL}/customers`,
      { name: nome, email, cpfCnpj: cpf },
      { headers: { access_token: ASAAS_API_KEY } }
    );

    // Criar pagamento
    const pagamento = await axios.post(
      `${ASAAS_URL}/payments`,
      {
        customer: cliente.data.id,
        billingType: metodo,
        value: 49.90,
        dueDate: new Date().toISOString().split("T")[0]
      },
      { headers: { access_token: ASAAS_API_KEY } }
    );

    res.json({ invoiceUrl: pagamento.data.invoiceUrl });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      message: err.response?.data?.errors?.[0]?.description || "Erro no Asaas"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor online"));
