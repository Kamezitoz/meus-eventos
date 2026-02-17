import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [eventos, setEventos] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [imagem, setImagem] = useState("");
  const [preview, setPreview] = useState(null);
  const [editandoId, setEditandoId] = useState(null);

  // 🔹 Carregar eventos salvos
  useEffect(() => {
    const salvos = localStorage.getItem("eventos");
    if (salvos) setEventos(JSON.parse(salvos));
  }, []);

  // 🔹 Salvar automaticamente
  useEffect(() => {
    localStorage.setItem("eventos", JSON.stringify(eventos));
  }, [eventos]);

  function selecionarImagem(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagem(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function salvarEvento(e) {
    e.preventDefault();

    if (!nome.trim()) return;

    if (editandoId) {
      setEventos(
        eventos.map((ev) =>
          ev.id === editandoId
            ? { ...ev, nome, descricao, data, imagem }
            : ev
        )
      );
      setEditandoId(null);
    } else {
      const novoEvento = {
        id: Date.now(),
        nome,
        descricao,
        data,
        imagem,
      };
      setEventos([...eventos, novoEvento]);
    }

    limparFormulario();
  }

  function limparFormulario() {
    setNome("");
    setDescricao("");
    setData("");
    setImagem("");
    setPreview(null);
  }

  function removerEvento(id) {
    setEventos(eventos.filter((ev) => ev.id !== id));
  }

  function editarEvento(evento) {
    setNome(evento.nome);
    setDescricao(evento.descricao);
    setData(evento.data);
    setImagem(evento.imagem);
    setPreview(evento.imagem);
    setEditandoId(evento.id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const eventosOrdenados = [...eventos].sort((a, b) => {
    if (!a.data) return 1;
    if (!b.data) return -1;
    return new Date(a.data) - new Date(b.data);
  });

  return (
    <div className="container">
      <h1>📅 Meus Eventos</h1>

      <form onSubmit={salvarEvento} className="card form">
        <h2>
          {editandoId ? "✏️ Editando Evento" : "Novo Evento"}
        </h2>

        <input
          type="text"
          placeholder="Nome do evento"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={selecionarImagem} />

        {preview && <img src={preview} className="preview" alt="" />}

        <button>
          {editandoId ? "Atualizar Evento" : "Salvar Evento"}
        </button>
      </form>

      {eventosOrdenados.length === 0 && (
        <p className="empty">Nenhum evento cadastrado</p>
      )}

      {eventosOrdenados.map((evento) => (
        <div
          className={`card evento ${
            editandoId === evento.id ? "editing" : ""
          }`}
          key={evento.id}
        >
          <strong>{evento.nome}</strong>

          <div className="data">
            {evento.data
              ? "📅 " + evento.data
              : "📌 Data indefinida"}
          </div>

          <p>{evento.descricao}</p>

          {evento.imagem && (
            <img src={evento.imagem} alt="" />
          )}

          <div className="acoes">
            <button onClick={() => editarEvento(evento)}>
              Editar
            </button>

            <button
              className="delete"
              onClick={() => removerEvento(evento.id)}
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
