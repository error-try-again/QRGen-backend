import request from 'supertest';
import { app } from '../server';
import {
  DEFAULT_MARGIN,
  DEFAULT_QR_PRECISION,
  DEFAULT_QR_SIZE,
  GOOGLE_MAPS_API_KEY,
  JSON_BODY_LIMIT,
  MAX_QR_CODES,
  ORIGIN,
  PORT,
  TRUST_PROXY,
  USE_SSL
} from '../config';

describe('API Endpoints', () => {

  describe('Configuration Variables', () => {
    it('should have a defined PORT variable', () => {
      expect(PORT).toBeDefined();
      expect(typeof PORT).toBe('number');
    });

    it('should correctly set the TRUST_PROXY variable', () => {
      expect(TRUST_PROXY).toBeDefined();
      expect(TRUST_PROXY).toBe(1);
    });

    it('should correctly set the JSON_BODY_LIMIT variable', () => {
      expect(JSON_BODY_LIMIT).toBeDefined();
      expect(JSON_BODY_LIMIT).toBe('1mb');
    });

    it('should correctly set the ORIGIN variable', () => {
      expect(ORIGIN).toBeDefined();
      expect(ORIGIN).toBe(process.env.ORIGIN || 'http://localhost:5173');
    });

    it('should correctly set the MAX_QR_CODES variable', () => {
      expect(MAX_QR_CODES).toBeDefined();
      expect(MAX_QR_CODES).toBe(1000);
    });

    it('should correctly set the DEFAULT_MARGIN variable', () => {
      expect(DEFAULT_MARGIN).toBeDefined();
      expect(DEFAULT_MARGIN).toBe(1);
    });

    it('should correctly set the DEFAULT_QR_SIZE variable', () => {
      expect(DEFAULT_QR_SIZE).toBeDefined();
      expect(DEFAULT_QR_SIZE).toBe(150);
    });

    it('should correctly set the DEFAULT_QR_PRECISION variable', () => {
      expect(DEFAULT_QR_PRECISION).toBeDefined();
      expect(DEFAULT_QR_PRECISION).toBe('M');
    });

    it('should correctly set the USE_SSL variable', () => {
      expect(USE_SSL).toBeDefined();
      expect(USE_SSL).toBe(process.env.USE_SSL === 'true');
    });

    it('should correctly set the GOOGLE_MAPS_API_KEY variable', () => {
      expect(GOOGLE_MAPS_API_KEY).toBeDefined();
      // Note: Can't test the exact value as it's sensitive, just test it's defined
    });

    describe('Test .env setup', () => {
      it('Should return google maps dev key - GOOGLE_MAPS_API_KEY', () => {
        const { GOOGLE_MAPS_API_KEY } = process.env;
        expect(GOOGLE_MAPS_API_KEY).toBeDefined();
      });
    });

    describe('Health Check Endpoint', () => {
      it('should respond correctly to a health check request', async () => {
        const { status, body } = await request(app).get('/qr/health');
        expect(status).toBe(200);
        expect(body).toEqual({ status: 'ok' });
      });
    });

    describe('Autocomplete Endpoint', () => {
      it('should respond correctly to a valid location request', async () => {
        const response = await request(app)
        .post('/qr/autocomplete')
        .send({ 'location': '23 Wallaby Way' })
        .set('Content-Type', 'application/json');
        expect(response.status).toBe(200);
      });

      it('should respond with 400 for an invalid location request', async () => {
        const { status, body } = await request(app)
        .post('/qr/autocomplete')
        .send({ 'location': '' })
        .set('Content-Type', 'application/json');
        expect(status).toBe(400);
        expect(body).toEqual({
          error: {
            message: 'Error occurred while fetching data from Google Maps Autocomplete API.',
            status: 400,
            type: 'GOOGLE_MAPS_AUTO_COMPLETE_ERROR'
          }
        });
      });
    });

    describe('QR Code Generation Endpoint', () => {
      it('should generate a QR code for type Text', async () => {
        const { status, body } = await request(app)
        .post('/qr/generate')
        .send({
          'customData': {
            'isLoading': false,
            'qrCodeURL': '',
            'margin': 2,
            'size': '150',
            'precision': 'H',
            'text': 'some-text'
          },
          'type': 'Text'
        })
        .set('Content-Type', 'application/json');
        expect(status).toBe(200);
        expect(body.qrCodeURL).toBeDefined();
        expect(body).toEqual({
          'qrCodeURL': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAAAklEQVR4AewaftIAAAQTSURBVO3BUZIqRhIEwcgy7n/l2Pfdhmx7gEIjKd3jH1R92FC1YKhaMFQtGKoWDFULhqoFQ9WCoWrBULVgqFrw4AeS8Juo3EjCMyo3knBSOSXhpPJMEk4qpyT8Jio3hqoFQ9WCoWrBULXgwZtUviEJN5LwaSo3VL5B5RuS8KqhasFQtWCoWjBULXiwIAnvUPkklWeScFI5JeGGyikJ35CEd6h80lC1YKhaMFQtGKoWPPgPUzkl4ZNUnknCv9lQtWCoWjBULRiqFgxVCx78ByThGZUbKqck1F8bqhYMVQuGqgVD1YIHC1R+E5VPU/lNVH6ToWrBULVgqFowVC148KYk/FMl4aRySsJJ5ZSEk8qnJeG3G6oWDFULhqoFQ9WCBz+g8tupnJLwDpVTEk4qn6byTzRULRiqFgxVC4aqBQ8WJOGkcisJ36ByIwknlVMSTiq3knBSOSXhG1ReNVQtGKoWDFULhqoF8Q++IAm3VF6VhG9QeUcSTiqflIRbKqcknFRuDFULhqoFQ9WCoWrBULXgwQ8k4aRySsJJ5VYSbqi8Q+WUhJPKKQknlVMSPi0JN1SeScK2oWrBULVgqFowVC148CVJeEblhsopCSeVUxKeScKrVG6ovCMJN1ROSXhG5ZSETxqqFgxVC4aqBUPVggc/oPIqlWeScFI5JeFGEv4JknBSOal8g8onDVULhqoFQ9WCoWrBgwUqpyTcSsJJ5ZSEd6h8UhJOKp+WhJPKpyXhpHJjqFowVC0YqhYMVQse/EASbqjcUjkl4ZSEV6k8k4STyt8lCa9KwknlmSScVD5pqFowVC0YqhYMVQse/IDKjSR8msopCSeVWyqnJNxQuZGEd6jcSMItlVMSPmmoWjBULRiqFgxVC4aqBQ9+IAmvUnkmCTeScFI5JeGk8g6VUxJuqDyThBtJeFUSnlHZNlQtGKoWDFULhqoF8Q/+RZJwS+WUhFepnJJwS+VVSfgGlRtD1YKhasFQtWCoWvDgB5Lwm6jcULmlciMJpyR8WhJOKjdUnknCSeWUhFcNVQuGqgVD1YKhasGDN6l8QxJelYRbKq9SuZWEGyqvSsIzKqcknFReNVQtGKoWDFULhqoFDxYk4R0qr1I5JeFWEm6onJLwjiR8ksrfZahaMFQtGKoWDFULHtT/pfJpKq9Kwo0kPKNyUvmkoWrBULVgqFowVC0YqhY8+JdJwknlVhJOSbihckrCM0k4qZyScFI5JeFWEl6lcmOoWjBULRiqFgxVCx4sUPm7qPwmKreScCMJJ5VTEp5R2TZULRiqFgxVC4aqBQ/elITfLgm3VE5JuJGEk8o7VG4k4dOScFK5MVQtGKoWDFULhqoF8Q+qPmyoWjBULRiqFgxVC4aqBUPVgqFqwVC1YKha8D+iGohKKl7z8gAAAABJRU5ErkJggg=='
        });
      });

      it('should generate a QR code for type URL', async () => {
        const { status, body } = await request(app)
        .post('/qr/generate')
        .send({
          'customData': {
            'isLoading': false,
            'qrCodeURL': '',
            'margin': 2,
            'size': '150',
            'precision': 'H',
            'url': 'https://www.google.com'
          },
          'type': 'Url'
        })
        .set('Content-Type', 'application/json');
        expect(status).toBe(200);
        expect(body.qrCodeURL).toBeDefined();
        expect(body).toEqual({
          'qrCodeURL': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAAAklEQVR4AewaftIAAAT8SURBVO3BQY4cOxYEwXCi7n9lHy0JbtiVyKf+GoQZ/pGql61UDVipGrBSNWClasBK1YCVqgErVQNWqgasVA345IeA/BY1bwFyo+YGyI2aHZCTmhOQnZoTkN+i5malasBK1YCVqgGfPKRmCpAngNyouQHyLTVPAHmDmilAvrVSNWClasBK1YCVqgGfvAjIt9RMUXMC8gY1b1BzAvIGIN9S84aVqgErVQNWqgZ88n8MyEnNt4DcAHkCyP+jlaoBK1UDVqoGrFQN+OQfBeRvUXMCslNzArJTcwJyUvOvW6kasFI1YKVqwCcvUvO3qDkB+RaQk5obNTdqngCyU/OEmt+yUjVgpWrAStWAlaoBnzwE5DcBOanZAXkDkJOaHZCTmh2Qk5oTkG8B+S9ZqRqwUjVgpWoA/pF/EJCTmm8BOal5A5An1PzrVqoGrFQNWKkasFI14JMXAblRcwPkb1FzAnKj5kbNDZAbIDdqTkB2av6WlaoBK1UDVqoGrFQN+OSHgOzUPAFkp+ak5gbIE0DeAORbak5q/hYgN2pOQHZqblaqBqxUDVipGvDJQ0BOar4F5EbNE0Bu1NwAeULNG9ScgNyo2QE5qdkBOan51krVgJWqAStVA1aqBuAfGQLkpOZbQJ5QMwXITs0TQG7U3AA5qXkDkJ2am5WqAStVA1aqBnwySM0JyE7NCciNmieAfEvNG4A8AeSk5g1AJqxUDVipGrBSNWClasAnLwJyo+ZGzQ7IFDUnIDsgTwDZqTkBOam5AfItIDdqTkC+tVI1YKVqwErVgE8eAnJS8wYgOzVPADmp2QG5UfM3AblRswNyAnKjZgfkDStVA1aqBqxUDVipGvDJLwNyUrMDclJzArJTcwIyAchJzRQgOzUnIN9ScwLyrZWqAStVA1aqBnzyQ0B2ak5Admpu1JyA3AB5g5oTkBsgOzUnIDdqTkBu1OyAvAHISc23VqoGrFQNWKkasFI14JMfUnOj5ltATmqeAHKjZgfkpGYH5A1qnlDzhJobIDs1b1ipGrBSNWClasAnPwRkp+YGyEnNTs0JyE7NT6jZAXkCyE7NDZAbICc1TwDZqTkB+S0rVQNWqgasVA1YqRrwyQ+puQHyLSAnNTsgJzUnIN9ScwJyA2Sn5gRkp+YE5KRmB+Q3AdmpuVmpGrBSNWClasBK1QD8Iw8AuVFzA+RGzQnISc0NkJ2aGyAnNd8CclJzAvJfpuZmpWrAStWAlaoBnzyk5g1q/muA7NQ8AWSn5gTkRs0TQG7U7IC8YaVqwErVgJWqAStVAz75ISC/Rc1PANmpOanZATmpuQFyo2YH5C1Admpu1JyA3Kj51krVgJWqAStVAz55SM0UIDdqTkB2QE5qdmp+k5oTkBs1b1AzYaVqwErVgJWqAStVAz55EZBvqXmLmh2QGyAnNTdqdkBu1DwB5A1AbtScgOzU3KxUDVipGrBSNeCTfxSQN6i5AXJSs1NzA+Qn1LwByLeAnNR8a6VqwErVgJWqAStVAz75P6LmBsi31ExRcwKyU3MD5KTmBshOzQnITs3NStWAlaoBK1UDPnmRmr9FzQ2QJ9TcANmpuVHzBJCTmp2aE5AbNTsgJzXfWqkasFI1YKVqwErVgE8eAvJfA2Sn5g1ATmq+BeQtQG7U/JaVqgErVQNWqgbgH6l62UrVgJWqAStVA1aqBqxUDVipGrBSNWClasD/ACuYJWxmW4coAAAAAElFTkSuQmCC'
        });
      });

      it('should generate a QR code for type Email', async () => {
        const { status, body } = await request(app)
        .post('/qr/generate')
        .send({
          'customData': {
            'isLoading': false,
            'qrCodeURL': '',
            'margin': 2,
            'size': '150',
            'precision': 'H',
            'email': 'test@example.com'
          },
          'type': 'Email'
        })
        .set('Content-Type', 'application/json');
        expect(status).toBe(200);
        expect(body.qrCodeURL).toBeDefined();
        expect(body).toEqual({
          'qrCodeURL': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAAAklEQVR4AewaftIAAAUlSURBVO3BQY5bORQEwUpC979yjpcEN5Q+9Lo9RkXgH6n6spWqAStVA1aqBqxUDVipGrBSNWClasBK1YCVqgGvvAnIb1HzDiA7NTdATmpugOzUnIDs1LwDyE7NCchvUXOzUjVgpWrAStWAVx5SMwXIDZCTmh2Qk5pPAbkBclKzA3JS8w1qpgD51ErVgJWqAStVA1aqBrzyRUA+peZbgOzUPAHkRs0NkBsgJzXfAORTar5hpWrAStWAlaoBr/xD1NwA+ZSaGyAnNTsg7wCyU/N/s1I1YKVqwErVgJWqAa/8w4DcqDkB2QE5qfkGNf+ilaoBK1UDVqoGvPJFan4TkJ2aE5AdkJOabwDyBJCdmifU/JaVqgErVQNWqgasVA145SEgfxs1OyAnNTsgN0BOam7U7IBMAfI3WakasFI1YKVqAP6RfwSQT6l5AsiNmh2Qd6j5v1upGrBSNWClasBK1QD8I18CZKfmBsi3qNkBOanZAXlCzQ7IT1KzAzJFzadWqgasVA1YqRqwUjXglYeAPAFkp+YGyLcA2al5AsiNmhsgN2pOQG7U3ADZqTkB2am5WakasFI1YKVqAP6RXwTkRs0JyI2aGyBPqPkUkHeo+RSQb1BzArJTc7NSNWClasBK1YCVqgH4R94A5FNqTkBu1OyAvEPNDsiNmhsgN2pOQHZqTkB+k5odkJOaT61UDVipGrBSNQD/yBAgJzU7IDdqTkBOanZATmq+AchOzRQgT6jZATmpmbBSNWClasBK1YCVqgGvvAnIjZqdmhOQGzU7IE+ouQHyhJodkBs1JyA/Rc0NkBs1NytVA1aqBqxUDXjlTWp2QE5Admpu1JyA3Kj5BjUnIDs1T6h5Qs0NkBsgOzUnIDs1JyCfWqkasFI1YKVqwErVgFe+SM2ngJzU7ICcgJzU7IA8oeanqDkBuVGzA3JSswNyUrMDclLzqZWqAStVA1aqBrzyJiA/BchOzbeouQHyKTUnIFOATFBzArJTc7NSNWClasBK1YCVqgGvvEnNDZAbNZ8CclJzo+YGyI2aE5AbNTsgT6g5AfmUmp+yUjVgpWrAStWAV94E5FNqboDcqDkBOanZATmpuVFzo+ZTak5ATmp2QE5qdkBOQHZqTkB2ar5hpWrAStWAlaoBK1UDXnmTmhsg36BmB+Sk5gTkBshOzQnIN6j5BjUnIDs1N0BOam7UfGqlasBK1YCVqgErVQPwj7wByI2abwByo+YJIDdqboDs1DwB5Dep2QE5qfnUStWAlaoBK1UDXnmTmp+i5gbIjZobNTdATmp2QE5qdkBOak5AdmqeALJTcwKyU3MCslNzs1I1YKVqwErVgJWqAa+8CchvUfMONTsgJzU7IE8AuQEyBchOzd9kpWrAStWAlaoBrzykZgqQb1BzArJTcwKyU/MEkJ2aE5An1HwKyEnNjZpPrVQNWKkasFI1YKVqwCtfBORTap5Q84SaHZCTmhsgN2p2QJ4A8lOA3Ki5WakasFI1YKVqwCv/MCA3ak5AdmpOanZAnlBzA+SkZgfkCSA3aj61UjVgpWrAStWAlaoBr/xPATmp2an5KWpOQJ4AslNzo+YEZKfmBOQGyE7NzUrVgJWqAStVA175IjU/Rc0NkJOaHZAngOzUnNR8A5AbNSc1OyAnNRNWqgasVA1YqRqwUjXglYeA/G2A3ADZqfkpQE5qnlDzKTVPANmpuVmpGrBSNWClagD+kaovW6kasFI1YKVqwErVgJWqAStVA1aqBqxUDfgPzLVhM31a1qkAAAAASUVORK5CYII='
        });
      });

    });

    describe('Places Endpoint', () => {
      it('should respond correctly to valid coordinates', async () => {
        const response = await request(app)
        .post('/qr/places')
        .send({
          'latitude': 51.5173665,
          'longitude': -0.5173665
        }).set('Content-Type', 'application/json');
        expect(response.status).toBe(200);
      });
    });
  });
});
