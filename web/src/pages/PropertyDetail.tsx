import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import RemasClient from '../clients/RemasClient';
import Page from '../components/Common/Page';
import ExpenseList from '../components/Property/ExpenseList';
import Metrics from '../components/Property/Metrics';
import OfferList from '../components/Property/OfferList';
import PropertyForm from '../components/Property/PropertyForm';
import PropertyNoteList from '../components/Property/PropertyNoteList';
import RehabEstimateList from '../components/Property/RehabEstimateList';
import { appRoutes } from '../config/app-config';
import { Property } from '../types/propertyTypes';
import { Query } from '../types/queryTypes';

interface UrlParams {
  id: string;
}

const defaultProperty: Property = {
  id: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  listingUrl: '',
  units: 1,
  watchlist: false,
  archived: false,
  offers: [],
  expenses: [],
  rehabEstimates: [],
  notes: [],
  metrics: [],
};

const PropertyDetail = () => {
  const { id } = useParams<UrlParams>();
  const history = useHistory();
  const [newId, setNewId] = useState<string>();
  const {
    isLoading,
    isError,
    data: properties,
  } = useQuery(Query.GET_PROPERTIES, RemasClient.getProperties, {
    onSuccess: (data) => {
      if (id === 'new' && newId) {
        history.push(`${appRoutes.PROPERTY_DETAIL}${newId}`);
      }
    },
  });
  const {
    isLoading: isMarketsLoading,
    isError: isMarketsError,
    data: markets,
  } = useQuery('getMarkets', RemasClient.getMarkets);

  // TODO: may need to clone this property to avoid mutating it
  const property =
    id === 'new'
      ? defaultProperty
      : properties && properties.find((prop) => prop.id === id);

  return (
    <Page
      title="Property Detail"
      closeText="RETURN TO LIST"
      closeUrl={appRoutes.PROPERTIES}
      isLoading={isLoading || isMarketsLoading}
      isError={isError || isMarketsError || (!isLoading && !property)}
    >
      {property && markets && (
        <Grid container spacing={6}>
          <Grid item md={8} xs={12}>
            <PropertyForm
              property={property}
              setNewId={setNewId}
              markets={markets}
            />
            {property.id && (
              <>
                <OfferList property={property} />
                <ExpenseList property={property} />
                <RehabEstimateList property={property} />
                <PropertyNoteList property={property} />
              </>
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            <Metrics property={property} />
          </Grid>
        </Grid>
      )}
    </Page>
  );
};

export default PropertyDetail;
