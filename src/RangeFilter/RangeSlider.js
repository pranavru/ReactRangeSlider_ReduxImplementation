import React, { Component } from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { MuiHandle, MuiRail, MuiTrack, MuiTick } from "./components"; // example render components - source below
import { format } from "date-fns";
import { scaleTime } from "d3-scale";
import BarChart from "./BarChart";

const sliderStyle = {
    position: "relative",
    width: "100%"
};

function formatTick(ms) {
    return format(new Date(ms), "MMM dd");
}

let multipleHours = 2

class RangeSlider extends Component {
    constructor(props) { super(props); }

    componentDidMount() {
        this.props.fetchMapFilter(this.props.DataVuzix);
    }

    setDateValueinMilliSeconds = (dateValue, label) => {
        let dateVal = new Date(dateValue);
        const dateTimeFormat = new Intl.DateTimeFormat('en-us', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
        let [{ value: month }, , { value: day }, , { value: year }, , { value: hours }] = dateTimeFormat.formatToParts(dateVal);
        if (multipleHours === 6) {
            hours -= hours % 6 === 1 ? 1 : hours % 6 === 2 ? 2 : hours % 6 === 3 ? 3 : hours % 6 === 4 ? 4 : hours % 6 === 5 ? 5 : 0;
        } else if (multipleHours === 4) {
            hours -= hours % 4 === 1 ? 1 : hours % 4 === 2 ? 2 : hours % 4 === 3 ? 3 : 0;
        } else if (multipleHours === 3) {
            hours -= hours % 3 === 1 ? 1 : hours % 3 === 2 ? 2 : 0;
        } else if (multipleHours === 2) {
            hours -= hours % 2 === 1 ? 1 : 0;
        }

        return new Date(`${month} ${day}, ${year} ${hours}:00:00`).getTime();
    }

    getDateFromMilliSeconds = (ms) => {
        return new Date(ms);
    }

    onChange = ([ms, ms1]) => {
        this.props.editMapFilter("mapDateRange", { type: "onChange", value: [ms, ms1] }, this.props.MapFilter.mapFilter)
    };

    onUpdate = ([ms, ms1]) => {
        this.props.editMapFilter("mapDateRange", { type: "update", value: [ms, ms1] }, this.props.MapFilter.mapFilter)
    };

    renderDateTime(date, header) {
        return (
            <div
                style={{
                    width: "100%",
                    textAlign: "center",
                    fontFamily: "Arial",
                    margin: 5
                }}
            >
                <b>{header}:</b>
                <div style={{ fontSize: 12 }}>{format(date[0], "MMM dd HH:mm")} {format(date[1], "MMM dd HH:mm")}</div>
            </div>
        );
    }

    render() {
        if (!this.props.MapFilter.isLoading) {
            const hours = 1000 * 60 * 30 * 2 * 3, multipleHours = 3
            const { updated, values, domain, data } = this.props.MapFilter.mapFilter.mapDateRange;

            const dateTicks = scaleTime()
                .domain(domain)
                .ticks(7)
                .map(d => +d);

            return (
                <div>
                    {/* {this.renderDateTime(values, "Selected")}
                    {this.renderDateTime(updated, "Updated")} */}
                    <div style={{ margin: "5%", height: "5%", width: "90%" }}>
                        {data.length > 0 ?
                            <BarChart
                                data={data}
                                highlight={updated}
                                domain={domain}
                                multipleHours={multipleHours}
                            /> : <></>
                        }
                        <Slider
                            mode={3}
                            step={hours}
                            values={values}
                            domain={domain}
                            rootStyle={sliderStyle}
                            onUpdate={this.onUpdate}
                            onChange={this.onChange}
                        >
                            <Rail>
                                {({ getRailProps }) => <MuiRail getRailProps={getRailProps} />}
                            </Rail>
                            <Handles>
                                {({ handles, getHandleProps }) => (
                                    <div>
                                        {handles.map(handle => (
                                            <MuiHandle
                                                key={handle.id}
                                                handle={handle}
                                                domain={domain}
                                                getHandleProps={getHandleProps}
                                            />
                                        ))}
                                    </div>
                                )}
                            </Handles>
                            <Tracks right={false} left={false}>
                                {({ tracks, getTrackProps }) => (
                                    <div>
                                        {tracks.map(({ id, source, target }) => (
                                            <MuiTrack
                                                key={id}
                                                source={source}
                                                target={target}
                                                getTrackProps={getTrackProps}
                                            />
                                        ))}
                                    </div>
                                )}
                            </Tracks>
                            <Ticks values={dateTicks}>
                                {({ ticks }) => (
                                    <div>
                                        {ticks.map(tick => (
                                            <MuiTick
                                                key={tick.id}
                                                tick={tick}
                                                count={ticks.length}
                                                format={formatTick}
                                            />
                                        ))}
                                    </div>
                                )}
                            </Ticks>
                        </Slider>
                    </div>
                </div >
            );
        } else {
            return <div></div>
        }
    }
}

export default RangeSlider;

// setMultipleHours(startDate, endDate) {
    //     const oneHour = 1000 * 60 * 30 * 2;
    //     const totalHours = (endDate - startDate) / (1000 * 30 * 60 * 2);
    //     if (totalHours <= 24) {
    //         this.setState({ multipleHours: 1, hours: oneHour });
    //     } else if (24 < totalHours <= 240) {
    //         this.setState({ multipleHours: 2, hours: oneHour * 2 });
    //     } else if (240 < totalHours <= 480) {
    //         this.setState({ multipleHours: 3, hours: oneHour * 3 });
    //     } else if (480 < totalHours <= 720) {
    //         this.setState({ multipleHours: 4, hours: oneHour * 4 });
    //     }
    // }