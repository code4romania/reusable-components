/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React, { useState } from "react";
import { ElectionScopeIncomplete } from "../../types/Election";
import { mockElectionAPI } from "../../util/mocks";
import { ElectionScopePicker, useElectionScopePickerApi } from "./ElectionScopePicker";

export default {
  title: "Election scope picker",
  component: ElectionScopePicker,
};

export const SimpleExample = () => {
  const [scope, setScope] = useState<ElectionScopeIncomplete>({ type: "national" });
  const apiData = useElectionScopePickerApi(mockElectionAPI, scope, 1);
  return <ElectionScopePicker apiData={apiData} value={scope} onChange={setScope} />;
};
