/**
 * Caminho: src/components/Contact/Form/index.tsx
 * Arquivo: index.tsx
 * Descrição: Formulário de Parceria, para propostas de colaboração (não é canal de agendamento de sessão, que é via WhatsApp).
 */
"use client";
import { useState } from "react";
import Image from "next/image";

const initialFormData = {
  name: "",
  company: "",
  email: "",
  whatsapp: "",
  partnershipType: "",
  message: "",
};

const ContactForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);

    fetch("https://formsubmit.co/ajax/karunodeva@gmail.com", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        _subject: "Nova proposta de parceria - Deva Karuno Terapias",
        nome: formData.name,
        empresa: formData.company,
        email: formData.email,
        whatsapp: formData.whatsapp,
        tipo_de_parceria: formData.partnershipType,
        mensagem: formData.message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSubmitted(data.success);
        setFormData(initialFormData);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error.message);
        setLoader(false);
      });
  };

  return (
    <section className="dark:bg-dark pb-24">
      <div className="container mx-auto lg:max-w-(--breakpoint-md) px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-3 text-midnight_text dark:text-white">
            Formulário de Parceria
          </h2>
          <p className="text-dustGray dark:text-white/60 text-base">
            Para propostas de colaboração, espaços para vivências, imprensa ou divulgação. Se você busca agendar uma sessão, use o WhatsApp acima.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-wrap w-full m-auto justify-between">
          <div className="sm:flex gap-3 w-full">
            <div className="mx-0 my-2.5 flex-1">
              <label htmlFor="name" className="pb-3 inline-block text-base">Nome completo*</label>
              <input
                id="name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-dark border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
              />
            </div>
            <div className="mx-0 my-2.5 flex-1">
              <label htmlFor="company" className="pb-3 inline-block text-base">Empresa/Organização</label>
              <input
                id="company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full text-base px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white dark:bg-dark border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
              />
            </div>
          </div>
          <div className="sm:flex gap-3 w-full">
            <div className="mx-0 my-2.5 flex-1">
              <label htmlFor="email" className="pb-3 inline-block text-base">E-mail*</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full text-base px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white dark:bg-dark border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
              />
            </div>
            <div className="mx-0 my-2.5 flex-1">
              <label htmlFor="whatsapp" className="pb-3 inline-block text-base">WhatsApp/Telefone</label>
              <input
                id="whatsapp"
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full text-base px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white dark:bg-dark border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
              />
            </div>
          </div>
          <div className="w-full">
            <div className="mx-0 my-2.5">
              <label htmlFor="partnershipType" className="pb-3 inline-block text-base">Tipo de parceria*</label>
              <select
                name="partnershipType"
                id="partnershipType"
                required
                value={formData.partnershipType}
                onChange={handleChange}
                className="w-full text-base px-4 py-2.5 rounded-lg border-border dark:text-white border-solid dark:bg-dark border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:outline-0"
              >
                <option value="">Selecione uma opção</option>
                <option value="Espaço para vivências">Espaço para vivências</option>
                <option value="Colaboração entre terapeutas">Colaboração entre terapeutas</option>
                <option value="Imprensa/Divulgação">Imprensa/Divulgação</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>
          <div className="w-full">
            <div className="mx-0 my-2.5">
              <label htmlFor="message" className="pb-3 inline-block text-base">Mensagem/Proposta*</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full text-base px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white dark:bg-dark border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
              />
            </div>
          </div>
          <div className="mx-0 my-2.5 w-full flex justify-center">
            <button
              type="submit"
              disabled={loader}
              className="bg-linear-to-r from-primary to-secondary rounded-lg text-white py-4 px-8 mt-4 inline-block hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
            >
              {loader ? "Enviando..." : "Enviar proposta"}
            </button>
          </div>
        </form>

        {submitted && (
          <div className="flex gap-1.5 mt-3.5 justify-center">
            <Image src="/images/icons/icon-right.svg" alt="" width={20} height={20} />
            <p className="text-secondary">Proposta enviada! Vamos retornar em breve.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactForm;