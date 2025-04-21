import React from 'react';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';

const AppCard = ({ app, theme, onOpenApp, isInUserList }) => {
  return (
    <Card className={`mb-3 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light'}`}>
      <img src={app.imageUrl} alt={app.appName} className="card-img-top" />
      <CardBody>
        <CardTitle tag="h5">{app.appName}</CardTitle>
        <CardText>{app.description}</CardText>
        <Button 
          color={isInUserList ? 'success' : 'primary'}
          onClick={() => onOpenApp(app.appId)}
          block
        >
          {isInUserList ? 'Open App' : 'Add to My List'}
        </Button>
      </CardBody>
    </Card>
  );
};

export default AppCard;
