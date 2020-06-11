import React, { useEffect, useState } from 'react';
import { Form, Input, Grid, Card, Statistic } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  // The transaction submission status
  const [status, setStatus] = useState('');

  // The currently stored value
  const [currentValue, setCurrentValue] = useState(0);
  const [formValue, setFormValue] = useState(0);

  useEffect(() => {
    let unsubscribe;
    api.query.constantConfig.singleValue(newValue => {
      setCurrentValue(newValue.toNumber());
    }).then(unsub => {
      unsubscribe = unsub;
    })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api.query.constantConfig]);

  return (
    <Grid.Column width={8}>
      <h1>Constant Configuration</h1>
      <Card centered>
        <Card.Content textAlign='center'>
          <Statistic
            label='Current Value'
            value={currentValue}
          />
        </Card.Content>
      </Card>
      <Form>
        <Form.Field>
          <Input
            label='Add Value'
            state='addValue'
            type='number'
            onChange={(_, { value }) => setFormValue(value)}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Add to the value'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'constantConfig',
              callable: 'addValue',
              inputParams: [formValue],
              paramFields: [true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function ConstantConfig (props) {
  const { api } = useSubstrate();
  return (api.query.constantConfig && api.query.constantConfig.singleValue
    ? <Main {...props} /> : null);
}
