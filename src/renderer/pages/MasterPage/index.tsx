import { Component } from 'react';

import { FetchApi } from 'renderer/components/Auth';
import EmployeeForm, { Employee } from 'renderer/components/EmployeeForm';
import InsuranceCompanyForm, { InsuranceCompany } from 'renderer/components/InsuranceCompanyForm';
import InsurancePolicyForm, { InsurancePolicy } from 'renderer/components/InsurancePolicyForm';
import ProjectForm, { Project } from 'renderer/components/ProjectForm';
import SubcontractorForm, { Subcontract } from 'renderer/components/SubcontractorForm';
import { Resource as BaseResource } from 'renderer/components/MasterForm';
import singularise from 'utils/singularise';

import './style.scss';

const resources = ['employees', 'subcontractors', 'positions', 'projects', 'insurance_policies', 'insurance_companies'] as const;

export type Data = Record<string, unknown>;
export type Files = Record<string, File>;
type InFlight = 'creating' | 'error' | 'fetching' | null;
type ResourceName = typeof resources[number];
type Resource = BaseResource & Record<string, unknown>;
type Resources = Map<ResourceName, Resource[]>;

interface Props {
  fetchApi: FetchApi;
}

interface State {
  activeSubTab: 'new' | 'edit' | 'view';
  activeTab: ResourceName;
  inFlight: InFlight;
  resourceEditing: Resource | null;
  resources: Resources;
}

export default class MasterPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      activeTab: 'employees',
      activeSubTab: 'new',
      inFlight: 'fetching',
      resourceEditing: null,
      resources: new Map()
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchResources();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.activeTab !== this.state.activeTab) {
      this.setState({
        resourceEditing: null
      });
    }
  }

  async fetchResources() {
    try {
      this.setState({
        inFlight: 'fetching'
      });
      const ret: Resources = new Map();
      await Promise.all(resources.map(async (resourceName) => {
        const response = await this.props.fetchApi('GET', resourceName);
        ret.set(resourceName, response[resourceName]);
      }));
      this.setState({
        inFlight: null,
        resources: ret
      });
    } catch (error) {
      console.error('[master] error while fetching', {
        error
      });
      this.setState({
        inFlight: 'error'
      });
    }
  }

  async handleDelete(id: string) {
    await this.props.fetchApi('DELETE', `${this.state.activeTab}/${id}`);
    await this.fetchResources();
  }

  async handleSubmit(data: Data, files: Files = {}) {
    const { activeSubTab, activeTab, resourceEditing } = this.state;
    const method = activeSubTab === 'edit' ? 'PUT' : 'POST';
    const endpoint = activeSubTab === 'edit' ? `${activeTab}/${resourceEditing?.id}` : activeTab
    await this.props.fetchApi(method, endpoint, { [singularise(activeTab)]: data }, {}, files);
    await this.fetchResources();
    this.setState({ activeSubTab: 'view' });
  }

  render() {
    const { activeSubTab, inFlight } = this.state;
    if (inFlight === 'fetching') {
      return <div>Loading...</div>;
    }

    if (inFlight === 'error') {
      return <div>An error occurred</div>
    }

    return (
      <div className="MasterPage">
        <div className="tabs">
          {this.renderTab('employees')}
          {this.renderTab('subcontractors')}
          {this.renderTab('projects')}
          {this.renderTab('insurance_policies')}
          {this.renderTab('insurance_companies')}
          {this.renderTab('positions')}
        </div>

        <div className="container">
          <div className="containerTabs">
            <button className={`containerTab newTab ${activeSubTab === 'new' ? 'active' : ''}`} onClick={() => this.setState({ activeSubTab: 'new'})}>New</button>
            <button className={`containerTab editTab ${activeSubTab === 'edit' ? 'active' : ''}`} onClick={() => this.setState({ activeSubTab: 'edit'})}>Edit</button>
            <button className={`containerTab viewTab ${activeSubTab === 'view' ? 'active' : ''}`} onClick={() => this.setState({ activeSubTab: 'view' })}>View</button>
          </div>
          <div className="containerContent">
            {activeSubTab === 'view' ? this.renderTable() : this.renderForm()}
          </div>
        </div>
      </div>
    );
  }

  renderForm() {
    const { activeSubTab, activeTab, resources, resourceEditing } = this.state;
    if (activeSubTab === 'edit' && !resourceEditing) {
      return (
        <div>Select a record from the view tab first</div>
      );
    }

    switch (activeTab) {
      case 'employees':
        return (
          <EmployeeForm
            employee={this.state.activeSubTab === 'edit' ? this.state.resourceEditing as unknown as Employee : undefined}
            fetchApi={this.props.fetchApi}
            onClose={() => this.setState({
              activeSubTab: 'view',
              resourceEditing: null
            })}
            onDelete={async () => {
              await this.handleDelete(resourceEditing?.id ?? '');
              this.setState({
                activeSubTab: 'view',
                resourceEditing: null
              });
            }}
            onSubmit={this.handleSubmit}
            positions={resources.get('positions') ?? []}
            projects={resources.get('projects') ?? []}
            // TODO
            subcontracts={[]}
          />
        );
      case 'insurance_companies':
        return (
          <InsuranceCompanyForm
            insuranceCompany={this.state.activeSubTab === 'edit' ? this.state.resourceEditing as unknown as InsuranceCompany : undefined}
            fetchApi={this.props.fetchApi}
            onClose={() => this.setState({
              activeSubTab: 'view',
              resourceEditing: null
            })}
            onDelete={async () => {
              await this.handleDelete(resourceEditing?.id ?? '');
              this.setState({
                activeSubTab: 'view',
                resourceEditing: null
              });
            }}
            onSubmit={this.handleSubmit}
          />
        );
      case 'insurance_policies':
        return (
          <InsurancePolicyForm
            insurancePolicy={this.state.activeSubTab === 'edit' ? this.state.resourceEditing as unknown as InsurancePolicy: undefined}
            fetchApi={this.props.fetchApi}
            onClose={() => this.setState({
              activeSubTab: 'view',
              resourceEditing: null
            })}
            onDelete={async () => {
              await this.handleDelete(resourceEditing?.id ?? '');
              this.setState({
                activeSubTab: 'view',
                resourceEditing: null
              });
            }}
            onSubmit={this.handleSubmit}
            projects={resources.get('projects') ?? []}
          />
        );
      case 'projects':
        return (
          <ProjectForm
            project={
              this.state.activeSubTab === 'edit'
                ? (this.state.resourceEditing as unknown as Project)
                : undefined
            }
            fetchApi={this.props.fetchApi}
            onClose={() => this.setState({
              activeSubTab: 'view',
              resourceEditing: null
            })}
            onDelete={async () => {
              await this.handleDelete(resourceEditing?.id ?? '');
              this.setState({
                activeSubTab: 'view',
                resourceEditing: null
              });
            }}
            onSubmit={this.handleSubmit}
          />
        );
      case 'subcontractors':
      return (
        <SubcontractorForm
          subcontractor={this.state.activeSubTab === 'edit' ? this.state.resourceEditing as unknown as Subcontract: undefined}
          fetchApi={this.props.fetchApi}
          onClose={() => this.setState({
            activeSubTab: 'view',
            resourceEditing: null
          })}
          onDelete={async () => {
            await this.handleDelete(resourceEditing?.id ?? '');
            this.setState({
              activeSubTab: 'view',
              resourceEditing: null
            });
          }}
          onSubmit={this.handleSubmit}
        />
      );
      default:
        return <></>;
    }
  }

  renderTab(name: ResourceName) {
    const label = name
      .replace(/_/g, ' ').split(' ')
      .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
      .join(' ');
    return (
      <button
        className={`tab ${this.state.activeTab === name ? 'active' : ''}`}
        onClick={() => this.setState({ activeTab: name })}
      >
        {label}
      </button>
    );
  }

  renderTable() {
    const resources = this.state.resources.get(this.state.activeTab) ?? [];
    const keys = Object.keys(resources[0] ?? {});
    return (
      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              <th></th>
              {keys.map((key) => <th>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr>
                <td>
                  <button
                    onClick={() => this.setState({
                      activeSubTab: 'edit',
                      resourceEditing: resource
                    })}
                  >Edit</button>
                  <button
                    onClick={() => this.handleDelete(resource.id)}
                  >
                    Delete
                  </button>
                </td>
                {Object.values(resource).map((value, index) => <td key={index}>{typeof value === 'string' ? value : JSON.stringify(value)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
