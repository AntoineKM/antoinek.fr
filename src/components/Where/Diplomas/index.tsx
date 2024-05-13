const Diplomas: React.FC = () => {
  return (
    <>
      <h3>{"🎓 Diplomas"}</h3>
      <p>
        {
          "Diplomas and certifications are important to me, they are the proof of my knowledge and my ability to learn, adapt to new technologies and achieve my goals."
        }
      </p>
      <ul>
        <li>
          <strong>{"onCrawl certification"}</strong>
          <p>{"2023"}</p>
        </li>
        <li>
          <strong>{"Permis B (driving license)"}</strong>
          <p>{"Rouen, France"}</p>
          <p>{"2021"}</p>
        </li>
        <li>
          <strong>
            {
              "Bachelor Concepteur développeur d'applications (bachelor degree in application development)"
            }
          </strong>
          <p>{"Need for School, Rouen, France"}</p>
          <p>{"2020 - 2023"}</p>
        </li>
        <li>
          <strong>
            {
              "Baccalauréat sciences et technologies de l'industrie et du développement durable spécialité Système d'Information et Numérique (high school diploma)"
            }
          </strong>
          <p>
            {
              "Lycée Pierre Corneille, Rouen, France | Lycée Blaise Pascal, Rouen, France"
            }
          </p>
          <p>{"2016 - 2019"}</p>
        </li>
        <li>
          <strong>{"Brevet des collèges (high school certificate)"}</strong>
          <p>{"Collège Ferdinand Buisson, Juvisy-sur-Orge, France"}</p>
          <p>{"2012 - 2016"}</p>
        </li>
      </ul>
    </>
  );
};

export default Diplomas;
