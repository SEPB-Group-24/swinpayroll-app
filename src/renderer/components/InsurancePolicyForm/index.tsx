import { Component } from 'react';
import { FetchApi } from 'renderer/components/Auth';
import MasterForm, { Resource } from 'renderer/components/MasterForm';
import { Data } from 'renderer/pages/MasterPage';

export interface InsurancePolicy {
  id?: string; 
  code: string;
  project_id?: string;
  insurance_company_id?: string;
  details: string;
  comment: string;
  start_date: string;
  end_date: string;
}

interface Props {
  insurancePolicy?: InsurancePolicy;
  fetchApi: FetchApi;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: Data) => void;
  insuranceCompanies: Resource[];
  projects: Resource[];
}

interface State {
  insurancePolicy: InsurancePolicy;
}

export default class InsurancePolicyForm extends Component<Props, State> {
  get defaultState() {
    return {
      insurancePolicy: this.props.insurancePolicy ?? {
        code: '',
        project_id: undefined,
        insurance_company_id: undefined,
        details: '',
        comment: '',
        start_date: '',
        end_date: '',
      }
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = this.defaultState;
  }
  
  render() {
    const { insuranceCompanies, projects  } = this.props;
    const { insurancePolicy } = this.state;
    return (
      <MasterForm<State['insurancePolicy']>
        isEditing={!!insurancePolicy}
        onChange={(key, value) => {
          if (!key) {
            return;
          }

          this.setState({
            insurancePolicy: {
              ...this.state.insurancePolicy,
              [key]: value
            }
          })
        }}
        onClose={this.props.onClose}
        onDelete={this.props.onDelete}
        onSubmit={() => this.props.onSubmit(this.state.insurancePolicy as unknown as Record<string, unknown>)}
      >
      <div>
        <div>
          Policy Code:
         <input name="code" type="text" value={this.state.insurancePolicy.code}/>
       </div>
        <div>
          Project ID:
         <select name="project_id" value={insurancePolicy.project_id}>
          {MasterForm.renderSelectOptions(projects, true)}
         </select>
        </div>
        <div>
          Insurance Company:
         <select name="insurance_company_id" value={insurancePolicy.insurance_company_id}>
           {MasterForm.renderSelectOptions(insuranceCompanies, true)}
         </select>
        </div>
        <div>
          Policy Details:
         <input name="details" type="text" value={this.state.insurancePolicy.details}/>
       </div>
        <div>
          Comment:
          <input name="comment" type="text" value={this.state.insurancePolicy.comment}/>
       </div>
        <div>
          Start Date:
          <input name="start_date" type="date" value={this.state.insurancePolicy.start_date}/>
        </div>
        <div>
          End Date:
         <input name="end_date" type="date" value={this.state.insurancePolicy.end_date}/>
        </div>
      </div>
      </MasterForm>
    );
  }
}
