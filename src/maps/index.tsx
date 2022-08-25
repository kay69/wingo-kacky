import { useEffect, useState } from 'react';
import { Button, ButtonGroup, ButtonToolbar, Col, Container, Row, Spinner } from 'react-bootstrap';

import { VStack } from '../components/VStack';

import { getMaps, MapEntry, ServerData } from './maps.service';

const LOCALE_LANG = 'fr-FR';
const LOCALE_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const pageSize = 17;

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

function formatTime(time: number) {
  const milliseconds = time % 1000;
  const seconds = Math.floor(time / 1000) % 60;
  const minutes = Math.floor(seconds / 60) % 60;

  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}.${milliseconds}`;
}

export function MapsList() {
  const [maps, setMaps] = useState<ServerData | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedMap, setSelectedMap] = useState<MapEntry | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await getMaps();
      setMaps(res);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <VStack className="gap-3 p-0 pb-2 text-center flex-fill h-100">
      {isLoading && (
        <Row>
          <Container className="justify-content-center align-items-center">
            <Spinner animation="border" role="status" className="loading-screen">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>
        </Row>
      )}
      {!isLoading && maps && (
        <>
          <Row>
            <span>
              Afin de respecter les ressources des serveurs de{' '}
              <a href="https://trackmania.io/" className="text-info text-decoration-none fw-lighter">
                trackmania.io
              </a>
              , les maps sont mises à jour progressivement sur 15 minutes (5 maps / minute).
            </span>
          </Row>
          <Row className="flex-fill">
            <div className="hstack gap-2">
              <VStack>
                <ButtonGroup size="sm" className="btn-group-justified flex-fill flex-wrap btn-group-leaderboard">
                  {maps.map((mapEntry, idx) => (
                    <Button
                      key={`${idx}-${mapEntry.id}`}
                      variant={selectedMap?.id === mapEntry.id ? 'white' : 'outline-white'}
                      className="m-1 w-10 p-0"
                      onClick={() => {
                        setSelectedMap(mapEntry);
                        setPage(0);
                      }}
                    >
                      <span className="fw-bolder"># {mapEntry.id}</span>
                      <br />
                      <span className="fw-lighter">{mapEntry.finishes.length}</span>
                    </Button>
                  ))}
                </ButtonGroup>
              </VStack>
              <VStack className="gap-2 p-0 pb-2 mt-1 text-center flex-fill h-100">
                <Row className="mb-3">
                  <ButtonToolbar>
                    <ButtonGroup size="sm" className="btn-group-justified flex-fill">
                      <Button variant="outline-white" className="mx-1 fw-bolder" onClick={() => setPage(0)} disabled={page === 0}>
                        Début
                      </Button>
                      <Button variant="outline-white" className="mx-1 fw-bolder" onClick={() => setPage(page - 1)} disabled={page === 0}>
                        Précédent
                      </Button>
                      <Button variant="white" className="mx-1 fw-bolder" disabled>
                        {page + 1} / {selectedMap && selectedMap.finishes.length ? Math.ceil(selectedMap.finishes.length / pageSize) : 1}
                      </Button>
                      <Button
                        variant="outline-white"
                        className="mx-1 fw-bolder"
                        onClick={() => setPage(page + 1)}
                        disabled={selectedMap ? page === Math.floor(selectedMap.finishes.length / pageSize) : true}
                      >
                        Suivant
                      </Button>
                      <Button
                        variant="outline-white"
                        className="mx-1 fw-bolder"
                        onClick={() => selectedMap && setPage(Math.floor(selectedMap.finishes.length / pageSize))}
                        disabled={selectedMap ? page === Math.floor(selectedMap.finishes.length / pageSize) : true}
                      >
                        Fin
                      </Button>
                    </ButtonGroup>
                  </ButtonToolbar>
                </Row>

                {selectedMap && (
                  <>
                    {selectedMap.id === 199 && selectedMap.finishes.length === 0 && (
                      <Row className="flex-fill justify-content-center align-items-center">
                        <span>La 199 est buggée, aucun finish n&apos;est disponible.</span>
                      </Row>
                    )}

                    {((selectedMap.id === 199 && selectedMap.finishes.length !== 0) || selectedMap.id !== 199) &&
                      selectedMap.finishes.slice(page * pageSize, page * pageSize + pageSize).map((finish, idx) => (
                        <Row key={idx} className="align-items-center">
                          <Col>{finish.position}</Col>
                          <Col>{finish.name}</Col>
                          <Col>{formatTime(finish.time)}</Col>
                          <Col>{new Date(finish.timestamp).toLocaleDateString(LOCALE_LANG, LOCALE_DATE_OPTIONS)}</Col>
                        </Row>
                      ))}
                  </>
                )}
              </VStack>
            </div>
          </Row>
        </>
      )}
    </VStack>
  );
}
