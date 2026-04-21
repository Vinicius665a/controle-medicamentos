// tests/integration.test.js
// Teste de integração — valida o consumo da API OpenFDA
// Executa com: node --test tests/integration.test.js  (Node 18+)

import { test } from 'node:test';
import assert from 'node:assert/strict';

const FDA_BASE = 'https://api.fda.gov/drug/label.json';

test('OpenFDA API — retorna resultado para medicamento conhecido', async () => {
  const res = await fetch(
    `${FDA_BASE}?search=openfda.brand_name:"losartan"&limit=1`
  );
  assert.equal(res.status, 200, 'Status HTTP deve ser 200');
  const data = await res.json();
  assert.ok(Array.isArray(data.results), 'data.results deve ser um array');
  assert.ok(data.results.length > 0, 'Deve retornar pelo menos 1 resultado');
});

test('OpenFDA API — resultado contém campos esperados', async () => {
  const res = await fetch(
    `${FDA_BASE}?search=openfda.brand_name:"metformin"&limit=1`
  );
  assert.equal(res.status, 200);
  const data = await res.json();
  const result = data.results[0];
  assert.ok(result.openfda, 'Campo openfda deve existir');
  assert.ok(
    result.purpose || result.indications_and_usage || result.description,
    'Deve conter pelo menos um campo de descrição'
  );
});

test('OpenFDA API — retorna 404 para medicamento inexistente', async () => {
  const res = await fetch(
    `${FDA_BASE}?search=openfda.brand_name:"xyzmed_inexistente_123"&limit=1`
  );
  assert.equal(res.status, 404, 'Medicamento inexistente deve retornar 404');
});

test('OpenFDA API — estrutura de meta está presente', async () => {
  const res = await fetch(`${FDA_BASE}?search=openfda.brand_name:"aspirin"&limit=1`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.meta, 'Campo meta deve estar presente');
  assert.ok(typeof data.meta.results.total === 'number', 'meta.results.total deve ser número');
});