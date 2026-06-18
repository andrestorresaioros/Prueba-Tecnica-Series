import { FormEvent, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { api } from './api/client';
import type { CreateDirectorPayload, CreateSeriesPayload, Director, Series, SeriesStatus } from './types';

type Tab = 'series' | 'directors';

const statusOptions: SeriesStatus[] = ['ANNOUNCED', 'EMISSION', 'FINISHED', 'CANCELLED'];

const emptySeriesForm: CreateSeriesPayload = {
  name: '',
  releaseDate: '',
  synopsis: '',
  country: '',
  seasons: 1,
  rating: 0,
  status: 'EMISSION',
  directorIds: [],
};

const emptyDirectorForm: CreateDirectorPayload = {
  fullName: '',
  nationality: '',
  birthDate: '',
  biography: '',
};

function App() {
  const [tab, setTab] = useState<Tab>('series');
  const [series, setSeries] = useState<Series[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [seriesForm, setSeriesForm] = useState<CreateSeriesPayload>(emptySeriesForm);
  const [directorForm, setDirectorForm] = useState<CreateDirectorPayload>(emptyDirectorForm);
  const [editingSeriesId, setEditingSeriesId] = useState<string | null>(null);
  const [editingDirectorId, setEditingDirectorId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDirectorSeries, setSelectedDirectorSeries] = useState<{ director: string; series: Series[] } | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const canCreateSeries = useMemo(() => directors.length > 0, [directors]);

  async function loadData() {
    setLoading(true);
    try {
      const [seriesResult, directorsResult] = await Promise.all([api.listSeries(search), api.listDirectors(search)]);
      setSeries(seriesResult);
      setDirectors(directorsResult);
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'No fue posible cargar la información.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function showMessage(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 4500);
  }

  function toInputDate(date?: string | null) {
    return date ? date.slice(0, 10) : '';
  }

  function cleanSeriesPayload(payload: CreateSeriesPayload): CreateSeriesPayload {
    return {
      ...payload,
      seasons: Number(payload.seasons || 1),
      rating: Number(payload.rating || 0),
      synopsis: payload.synopsis?.trim() || undefined,
      country: payload.country?.trim() || undefined,
    };
  }

  async function handleSeriesSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!seriesForm.directorIds.length) {
      showMessage('Selecciona al menos un director para la serie.');
      return;
    }

    try {
      if (editingSeriesId) {
        await api.updateSeries(editingSeriesId, cleanSeriesPayload(seriesForm));
        showMessage('Serie actualizada correctamente.');
      } else {
        await api.createSeries(cleanSeriesPayload(seriesForm));
        showMessage('Serie registrada correctamente.');
      }
      setSeriesForm(emptySeriesForm);
      setEditingSeriesId(null);
      await loadData();
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'No fue posible guardar la serie.');
    }
  }

  async function handleDirectorSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const payload = {
        ...directorForm,
        nationality: directorForm.nationality?.trim() || undefined,
        birthDate: directorForm.birthDate || undefined,
        biography: directorForm.biography?.trim() || undefined,
      };

      if (editingDirectorId) {
        await api.updateDirector(editingDirectorId, payload);
        showMessage('Director actualizado correctamente.');
      } else {
        await api.createDirector(payload);
        showMessage('Director registrado correctamente.');
      }

      setDirectorForm(emptyDirectorForm);
      setEditingDirectorId(null);
      await loadData();
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'No fue posible guardar el director.');
    }
  }

  function editSeries(item: Series) {
    setTab('series');
    setEditingSeriesId(item.id);
    setSeriesForm({
      name: item.name,
      releaseDate: toInputDate(item.releaseDate),
      synopsis: item.synopsis ?? '',
      country: item.country ?? '',
      seasons: item.seasons,
      rating: item.rating ?? 0,
      status: item.status,
      directorIds: item.directors.map((director) => director.id),
    });
  }

  function editDirector(item: Director) {
    setTab('directors');
    setEditingDirectorId(item.id);
    setDirectorForm({
      fullName: item.fullName,
      nationality: item.nationality ?? '',
      birthDate: toInputDate(item.birthDate),
      biography: item.biography ?? '',
    });
  }

  async function deleteSeries(id: string) {
    const result = await Swal.fire({
      title: '¿Eliminar esta serie?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
    });

    if (!result.isConfirmed) return;

    try {
      await api.deleteSeries(id);
      await Swal.fire({
        title: 'Serie eliminada',
        text: 'La serie se eliminó correctamente.',
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
      });
      await loadData();
    } catch (error) {
      await Swal.fire({
        title: 'No fue posible eliminar la serie',
        text: error instanceof Error ? error.message : 'Intenta nuevamente en unos segundos.',
        icon: 'error',
      });
    }
  }

  async function deleteDirector(id: string) {
    const result = await Swal.fire({
      title: '¿Eliminar este director?',
      text: 'También se eliminarán sus asociaciones con series.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
    });

    if (!result.isConfirmed) return;

    try {
      await api.deleteDirector(id);
      await Swal.fire({
        title: 'Director eliminado',
        text: 'El director se eliminó correctamente.',
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
      });
      await loadData();
    } catch (error) {
      await Swal.fire({
        title: 'No fue posible eliminar el director',
        text: error instanceof Error ? error.message : 'Intenta nuevamente en unos segundos.',
        icon: 'error',
      });
    }
  }

  async function showDirectorSeries(director: Director) {
    try {
      const result = await api.getDirectorSeries(director.id);
      setSelectedDirectorSeries({ director: result.director.fullName, series: result.series });
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'No fue posible consultar las series del director.');
    }
  }

  function toggleDirector(directorId: string) {
    setSeriesForm((current) => {
      const exists = current.directorIds.includes(directorId);
      return {
        ...current,
        directorIds: exists
          ? current.directorIds.filter((id) => id !== directorId)
          : [...current.directorIds, directorId],
      };
    });
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Prueba técnica OATI · Punto 5</p>
          <h1>Gestión de series de televisión y directores</h1>
          <p>
            CRUD completo con relación muchos a muchos: una serie puede tener varios directores y un director puede
            participar en muchas series.
          </p>
        </div>
        <a
          href={(import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1').replace('/api/v1', '/api/docs')}
          target="_blank"
          rel="noreferrer"
          className="swagger-link"
        >
          Ver Swagger
        </a>
      </section>

      <section className="toolbar">
        <div className="tabs">
          <button className={tab === 'series' ? 'active' : ''} onClick={() => setTab('series')}>
            Series
          </button>
          <button className={tab === 'directors' ? 'active' : ''} onClick={() => setTab('directors')}>
            Directores
          </button>
        </div>
        <form
          className="search-box"
          onSubmit={(event) => {
            event.preventDefault();
            loadData();
          }}
        >
          <input placeholder="Buscar por serie, país o director" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit">Buscar</button>
        </form>
      </section>

      {message && <p className="toast">{message}</p>}
      {loading && <p className="loading">Cargando información...</p>}

      {tab === 'series' ? (
        <section className="grid-layout">
          <form className="card form-card" onSubmit={handleSeriesSubmit}>
            <h2>{editingSeriesId ? 'Editar serie' : 'Nueva serie'}</h2>
            {!canCreateSeries && <p className="hint">Primero registra al menos un director.</p>}
            <label>
              Nombre
              <input required value={seriesForm.name} onChange={(e) => setSeriesForm({ ...seriesForm, name: e.target.value })} />
            </label>
            <label>
              Fecha de lanzamiento
              <input
                required
                type="date"
                value={seriesForm.releaseDate}
                onChange={(e) => setSeriesForm({ ...seriesForm, releaseDate: e.target.value })}
              />
            </label>
            <div className="form-row">
              <label>
                País
                <input value={seriesForm.country} onChange={(e) => setSeriesForm({ ...seriesForm, country: e.target.value })} />
              </label>
              <label>
                Temporadas
                <input
                  type="number"
                  min="1"
                  value={seriesForm.seasons}
                  onChange={(e) => setSeriesForm({ ...seriesForm, seasons: Number(e.target.value) })}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Calificación
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={seriesForm.rating}
                  onChange={(e) => setSeriesForm({ ...seriesForm, rating: Number(e.target.value) })}
                />
              </label>
              <label>
                Estado
                <select
                  value={seriesForm.status}
                  onChange={(e) => setSeriesForm({ ...seriesForm, status: e.target.value as SeriesStatus })}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Sinopsis
              <textarea value={seriesForm.synopsis} onChange={(e) => setSeriesForm({ ...seriesForm, synopsis: e.target.value })} />
            </label>
            <fieldset className="director-selector">
              <legend>Directores</legend>
              {directors.map((director) => (
                <label key={director.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={seriesForm.directorIds.includes(director.id)}
                    onChange={() => toggleDirector(director.id)}
                  />
                  {director.fullName}
                </label>
              ))}
            </fieldset>
            <div className="actions">
              <button disabled={!canCreateSeries} type="submit">
                {editingSeriesId ? 'Guardar cambios' : 'Registrar serie'}
              </button>
              {editingSeriesId && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setEditingSeriesId(null);
                    setSeriesForm(emptySeriesForm);
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <section className="list-panel">
            {series.map((item) => (
              <article className="card item-card" key={item.id}>
                <div>
                  <p className="status">{item.status}</p>
                  <h3>{item.name}</h3>
                  <p className="muted">
                    {new Date(item.releaseDate).getFullYear()} · {item.country ?? 'País no definido'} · {item.seasons} temporada(s)
                  </p>
                  <p>{item.synopsis ?? 'Sin sinopsis registrada.'}</p>
                  <p className="directors-list">
                    <strong>Directores:</strong> {item.directors.map((director) => director.fullName).join(', ')}
                  </p>
                </div>
                <div className="actions compact">
                  <button onClick={() => editSeries(item)}>Editar</button>
                  <button className="danger" onClick={() => deleteSeries(item.id)}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </section>
        </section>
      ) : (
        <section className="grid-layout">
          <form className="card form-card" onSubmit={handleDirectorSubmit}>
            <h2>{editingDirectorId ? 'Editar director' : 'Nuevo director'}</h2>
            <label>
              Nombre completo
              <input
                required
                value={directorForm.fullName}
                onChange={(e) => setDirectorForm({ ...directorForm, fullName: e.target.value })}
              />
            </label>
            <label>
              Nacionalidad
              <input
                value={directorForm.nationality}
                onChange={(e) => setDirectorForm({ ...directorForm, nationality: e.target.value })}
              />
            </label>
            <label>
              Fecha de nacimiento
              <input
                type="date"
                value={directorForm.birthDate}
                onChange={(e) => setDirectorForm({ ...directorForm, birthDate: e.target.value })}
              />
            </label>
            <label>
              Biografía
              <textarea
                value={directorForm.biography}
                onChange={(e) => setDirectorForm({ ...directorForm, biography: e.target.value })}
              />
            </label>
            <div className="actions">
              <button type="submit">{editingDirectorId ? 'Guardar cambios' : 'Registrar director'}</button>
              {editingDirectorId && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setEditingDirectorId(null);
                    setDirectorForm(emptyDirectorForm);
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <section className="list-panel">
            {directors.map((director) => (
              <article className="card item-card" key={director.id}>
                <div>
                  <h3>{director.fullName}</h3>
                  <p className="muted">{director.nationality ?? 'Nacionalidad no registrada'}</p>
                  <p>{director.biography ?? 'Sin biografía registrada.'}</p>
                  <p className="directors-list">
                    <strong>Series registradas:</strong> {director.series?.length ?? 0}
                  </p>
                </div>
                <div className="actions compact">
                  <button onClick={() => showDirectorSeries(director)}>Ver series</button>
                  <button onClick={() => editDirector(director)}>Editar</button>
                  <button className="danger" onClick={() => deleteDirector(director.id)}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </section>
        </section>
      )}

      {selectedDirectorSeries && (
        <section className="card modal-card">
          <div className="modal-header">
            <h2>Series de {selectedDirectorSeries.director}</h2>
            <button className="secondary" onClick={() => setSelectedDirectorSeries(null)}>
              Cerrar
            </button>
          </div>
          {selectedDirectorSeries.series.length ? (
            <ul>
              {selectedDirectorSeries.series.map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong> · {new Date(item.releaseDate).getFullYear()} · {item.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>Este director aún no tiene series asociadas.</p>
          )}
        </section>
      )}
    </main>
  );
}

export default App;
