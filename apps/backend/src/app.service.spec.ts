import { AppService } from './app.service';

describe('AppService', () => {
  it('health returns ok', () => {
    const svc = new AppService();
    expect(svc.health()).toEqual({ ok: true, service: 'habesha-backend' });
  });
});
