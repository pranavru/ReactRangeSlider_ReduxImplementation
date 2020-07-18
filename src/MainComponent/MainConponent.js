import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDataVuzix, fetchMapFilter, editMapFilter, updateMapAddressOnExpiry, } from '../redux/ActionCreators'
import RangeSlider from '../RangeFilter/RangeSlider';

const mapStateToProps = (state) => {
    return {
        DataVuzix: state.dataVuzix,
        MapFilter: state.mapFilter,
        DetailDivData: state.detailDivData,
        addressValue: state.addressValue
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchDataVuzix: () => dispatch(fetchDataVuzix),
    fetchMapFilter: (data, dateMap) => dispatch(fetchMapFilter(data, dateMap)),
    editMapFilter: (type, newValue, props) => dispatch(editMapFilter(type, newValue, props)),
    updateMapAddressOnExpiry: () => dispatch(updateMapAddressOnExpiry())
})

class MainComponent extends Component {
    constructor(props) { super(props); }

    componentDidMount = () => this.props.fetchDataVuzix();

    render() {
        return (
            <>
                {this.props.DataVuzix.dataVuzix.vuzixMap !== undefined ?
                    <RangeSlider
                        DataVuzix={this.props.DataVuzix.dataVuzix}
                        MapFilter={this.props.MapFilter}

                        fetchMapFilter={this.props.fetchMapFilter}
                        editMapFilter={this.props.editMapFilter}
                    /> : <></>
                }
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);