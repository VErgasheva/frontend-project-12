import { Container, Row, Col, Card, CardBody, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function FormContainer({ children, image, imageAlt, regfooter }) {
  const { t } = useTranslation()
  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12" md="8" xxl="6">
          <Card className="shadow-sm">
            <CardBody className="p-5">
              <Row>
                <Col md="6" className="col-12 d-flex align-items-center justify-content-center">
                  <Image src={image} alt={imageAlt} roundedCircle />
                </Col>
                <Col md="6" className="col-12 mt-3 mt-md-0">
                  {children}
                </Col>
              </Row>
            </CardBody>
            {regfooter && (
              <Card.Footer className="p-4">
                <div className="text-center">
                  <span>{t('Don\'t have an account? ')}</span>
                  <Link to="/signup">{t('Registration')}</Link>
                </div>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default FormContainer
