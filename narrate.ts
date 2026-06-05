import { createFileRoute } from "@tanstack/react-router";

const NARRATIONS: Record<string, string> = {
  "0": "Imagine transformar cada cidadão presente em um divulgador oficial da sua cidade. A MK Audiovisual apresenta a Prefeitura Digital 360 — a solução definitiva de imagem, presença e marketing público para a sua gestão. Prepare-se, porque o que você verá agora vai mudar a forma como a sua prefeitura conversa com a população.",
  "1": "Hoje a prefeitura ainda comunica como nos anos noventa: panfletos, carro de som e um perfil oficial que poucos seguem. Enquanto isso, a vida acontece nos celulares. É nesse ponto exato que a sua gestão precisa estar. E nós entregamos isso.",
  "2": "Sabe qual é o verdadeiro desafio? Não é só fazer o evento — é fazer o evento ser visto. Sem registro profissional, sem compartilhamento espontâneo, o trabalho da prefeitura simplesmente desaparece do feed. E o que não é visto, não é lembrado. E o que não é lembrado, não gera valor político.",
  "3": "É aqui que a tecnologia entra em ação. Apresentamos a Plataforma 360 graus — uma estrutura imersiva, profissional, futurista. O cidadão entra, vive uma experiência cinematográfica e, em segundos, recebe o seu vídeo personalizado direto no celular, pronto para compartilhar. É um totem fotográfico premium funcionando como a maior máquina de marketing orgânico que uma prefeitura pode ter.",
  "4": "A jornada é simples e poderosa. O cidadão é convidado, vive a experiência, recebe o conteúdo via QR Code e compartilha imediatamente nas redes sociais dele. Em minutos, a sua cidade está aparecendo em centenas, milhares de stories ao mesmo tempo.",
  "5": "Quando você multiplica isso pela quantidade de pessoas em um único evento, o alcance é absurdo. Estamos falando de dezenas de milhares de visualizações orgânicas, geradas pelos próprios cidadãos, com a identidade visual da sua gestão em cada compartilhamento. Isso é mídia espontânea — e mídia espontânea é a mais valiosa que existe.",
  "6": "Não é teoria. Já aplicamos em eventos públicos com filas enormes, cidadãos felizes e prefeitura dominando o assunto da cidade nas redes sociais durante dias. É um case real, replicável, que funciona em qualquer município.",
  "7": "E o melhor: serve para tudo. Aniversário da cidade, festas juninas, festivais culturais, inaugurações de obras, eventos esportivos, turismo. Qualquer evento da sua gestão se transforma em uma oportunidade gigante de comunicação digital.",
  "8": "E atenção a este ponto, porque ele é decisivo: cada foto e cada vídeo entregue carrega a marca oficial da gestão. Logo do município, hashtag oficial, nome do evento. A identidade da prefeitura passa a viver dentro do celular de cada cidadão. É branding público, multiplicado em massa.",
  "9": "O resultado prático para a gestão são quatro entregas claras: engajamento real da população, transparência visual mostrando eventos cheios e cidadãos felizes, domínio absoluto das redes sociais nos dias de evento e valorização — porque cada cidadão leva para casa uma recordação premium, oferecida pela prefeitura.",
  "10": "E quem entrega tudo isso, ponta a ponta, é a MK Audiovisual. Plataforma 360 de alta performance, totem fotográfico com moldura digital, personalização completa da identidade visual, equipe operacional uniformizada e sistema de compartilhamento via QR Code. Você não contrata um serviço — você contrata uma operação completa de imagem.",
  "11": "Então fica a pergunta: a sua prefeitura vai continuar competindo pela atenção da população usando ferramentas do passado, ou vai dar o próximo passo e modernizar a comunicação da sua cidade? Fale agora com a MK Audiovisual. Vamos transformar cada participante em um divulgador oficial da sua gestão.",
};

const VOICE_ID = "onwK4e9ZLuTAKqWW03F9"; // Daniel - confident male narrator

export const Route = createFileRoute("/api/public/narrate")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const slide = url.searchParams.get("slide") || "0";
        const text = NARRATIONS[slide];
        if (!text) return new Response("Slide not found", { status: 404 });

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) return new Response("Missing API key", { status: 500 });

        const r = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
          {
            method: "POST",
            headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.45,
                similarity_boost: 0.8,
                style: 0.55,
                use_speaker_boost: true,
                speed: 1.0,
              },
            }),
          }
        );

        if (!r.ok) {
          const err = await r.text();
          return new Response(`TTS error: ${err}`, { status: 500 });
        }

        const buf = await r.arrayBuffer();
        return new Response(buf, {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
